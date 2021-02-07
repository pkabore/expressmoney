const express = require('express');
const session = require('client-sessions');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const Account = require('./api/models/Account.js');
const Operation = require('./api/models/Operation.js');
const Notification = require('./api/models/Notification.js');
const APIKey = require('./api/models/APIKey.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const csurf = require('csurf');
const onHeaders = require('on-headers');

require('dotenv').config();
const databaseConnection = require('./api/utils/database.js');
const { loadNuxt, build } = require('nuxt');
const app = require('express')();

const operations = require('./api/routes/operations.js');
const account = require('./api/routes/account.js');
const complete = require('./api/routes/complete.js');

const isDev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

async function start() {
	const nuxt = await loadNuxt(isDev ? 'dev' : 'start');

	await databaseConnection();

	const ensureAuthentication = (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		}
		res.status(401).send('Not authenticated');
	};

	passport.serializeUser((account, done) => {
		return done(null, account._id);
	});

	passport.deserializeUser((_id, done) => {
		Account.findById(_id).select('name tel email confirmation isAccountValidated').exec((err, account) => {
			if (err) {
				return done(err);
			}
			return done(null, account);
		});
	});

	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'pwd'
			},
			async (email, pwd, done) => {
				Account.findOne({ $or: [ { email }, { tel: email } ] }, (err, account) => {
						if (err) {
							return done(err);
						}
						if (!account) {
							return done(null, false, {
								message: 'Mot de passe, numéro ou e-mail incorrect.'
							});
						}
						bcrypt.compare(pwd, account.pwd, (bcrypt_err, bcrypt_res) => {
							if (bcrypt_err) {
								return done(err);
							}
							if (!bcrypt_res) {
								return done(null, false, {
									message: 'Mot de passe, numéro ou e-mail incorrect.'
								});
							}
							const sessionAccount = {
								_id: account._id,
								name: account.name,
								tel: account.tel,
								email: account.email,
								accountRegistrationCode: account.accountRegistrationCode,
								isAccountValidated: account.isAccountValidated
							};
							return done(null, sessionAccount);
						});
					});
			}
		)
	);

	passport.use(
		new HeaderAPIKeyStrategy(
			{
				header: 'Authorization',
				prefix: 'Api-Key '
			},
			false,
			(apikey, done) => {
				APIKey.findOne({ apikey: apikey }, (err, apikey) => {
					if (err) {
						return done(err);
					}
					if (!apikey) {
						return done(null, false);
					}
					return done(null, apikey);
				});
			}
		)
	);

	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());
	app.use(cookieParser());
	app.use(csurf({ cookie: true }));
	app.use(
		session({
			cookieName: 'session',
			secret: process.env.SESSION_SECRET,
			duration: parseInt(process.env.SESSION_DURATION, 10),
			saveUninitialized: false,
			resave: false,
			cookie: {
				ephemeral: true,
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production'
			}
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());

	app.use('/api/auth', account);
	app.use('/api/complete', complete);
	app.use('/api/operations', operations);

	const fs = require('fs');
	app.get('/dossiers/:id', ensureAuthentication, async (req, res) => {
		if (!req.params.id) return res.status(403).end();
		const account = await Account.findById(req.user.id);
		if (!account) return res.status(403).end();
		if (account.idUri !== req.params.id && account.wcardUri !== req.params.id && account.codcUri !== req.params.id)
			return res.status(403).end();
		const path = __dirname + `/dossiers/${req.params.id}`;
		try {
			if (fs.existsSync(path)) return res.sendFile(path);
			else res.status(404).send('Fichier non trouvé!');
		} catch (err) {
			console.error(err);
		}
	});

	app.get(
		'/remote-access/dossiers/:id',
		passport.authenticate('headerapikey', {
			session: false
		}),
		(req, res) => {
			const path = __dirname + `/dossiers/${req.params.id}`;
			try {
				if (fs.existsSync(path)) return res.sendFile(path);
				else res.status(404).send('Fichier non trouvé!');
			} catch (err) {
				console.error(err);
			}
		}
	);
	/*------------------------------------------------------------------------*/
	app.get('/api/auth/csrf', (req, res) => {
		res.json({ token: req.csrfToken() });
	});

	//Render every route with Nuxt.js
	app.use(nuxt.render);

	//Build only in dev mode with hot-reloading
	if (isDev) {
		build(nuxt);
	}

	//Listen the server
	app.listen(port, '0.0.0.0');
	console.log('Server listening on `localhost:' + port + '`.');
}

start();
