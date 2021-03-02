const express = require('express');
const session = require('client-sessions');
const mongoose = require('mongoose');
const Account = require('./models/Account.js');
const Operation = require('./models/Operation.js');
const Notification = require('./models/Notification.js');
const APIKey = require('./models/APIKey.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const onHeaders = require('on-headers');
const fs = require('fs');

const databaseConnection = require('./utils/database.js');
const operations = require('./routes/operations.js');
const account = require('./routes/account.js');

const app = require('express')();

databaseConnection(() => {
	console.log('Database connected ...');
});

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
	Account.findById(_id, (err, account) => {
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
						message: 'Email ou mot de passe incorrect(s).'
					});
				}
				if (account.accountRegistrationCode != '') {
					return done(null, false, {
						message:
							"Votre email n'a pas encore été vérifiée. Veuillez cliquer sur le lien envoyé à votre adresse email pour vérifier votre compte."
					});
				}
				bcrypt.compare(pwd, account.pwd, (bcrypt_err, bcrypt_res) => {
					if (bcrypt_err) {
						return done(err);
					}
					if (!bcrypt_res) {
						return done(null, false, {
							message: 'Email ou mot de passe incorrect(s).'
						});
					}
					const sessionAccount = {
						_id: account._id,
						name: account.name,
						tel: account.tel,
						email: account.email,
						isAccountValidated: account.isAccountValidated,
						isEmailVerified: account.accountRegistrationCode === '' ? true : false,
						uploadingFile: account.uploadingFile
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

app.use(cookieParser());
app.use(csurf({ cookie: true }));

const sessionSecret = process.env.SESSION_SECRET;
app.use(
	session({
		secret: sessionSecret,
		cookieName: 'session',
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 12 * 60 * 60 * 1000,
			httpOnly: true
		}
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/auth', account);
app.use('/api/operations', ensureAuthentication, operations);

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

module.exports = app;
