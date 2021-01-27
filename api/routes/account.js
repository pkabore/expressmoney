const express = require('express');
const Account = require('../models/Account.js');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const router = express.Router();

const ensureAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).end();
};

/*-------------------------account routes------------------------------*/
router.get('/account', ensureAuthentication, (req, res) => {
	Account.findOne({ email: req.user.email }).select('-pwd -_id').exec((err, account) => {
		if (err) return res.status(500).json({ message: 'Erreur survenue. Veuillez reéssayer.' });
		return res.json(account);
	});
});

router.post('/delete', ensureAuthentication, (req, res) => {
	Account.findOne({ email: req.user.email }, async (err, account) => {
		if (err) return res.status(500).json({ message: 'Erreur survenue. Veuillez reéssayer.' });
		account.isAccountValidated = 'Suppression';
		await account.save();
		return res.json({ message: 'ok' });
	});
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);
		if (!user) return res.status(400).json(info);
		req.logIn(user, (err) => {
			if (err) return next(err);
			return res.status(200).end();
		});
	})(req, res, next);
});

router.post('/logout', (req, res) => {
	req.logout();
	res.json({ message: 'ok' });
});

router.post('/register', (req, res, next) => {
	const tel = req.body.data.tel;
	const email = req.body.data.email;
	Account.findOne({ $or: [ { tel }, { email } ] }, (err, doc) => {
		if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
		if (doc) return res.status(400).json({ err: 'Numéro ou e-mail déjà utilisé. Veuillez vous connecter.' });
		const fieldsValidationResult = validateAccountInformations(req.body.data);
		if (fieldsValidationResult) return res.status(400).json({ message: fieldsValidationResult });
		if (req.body.data.pwd !== req.body.data.confirmedPWD)
			return res.status(400).json({ err: 'Mots de passe différents' });
		bcrypt.hash(req.body.data.pwd, parseInt(process.env.BCRYPT_WORK_FACTOR), (bcrypt_err, hashedPassword) => {
			if (bcrypt_err) return res.status(500).json({ message: 'Erreur survenue. Veuillez reéssayer.' });
			const account = new Account({
				name: req.body.data.fname + ' ' + req.body.data.lname,
				tel: req.body.data.tel,
				email: req.body.data.email,
				isAccountValidated: '',
				pwd: hashedPassword
			});
			account.save((mongoose_err, result) => {
				if (mongoose_err)
					return res.status(400).json({
						err: 'Erreur survenue. Veuillez reéssayer.'
					});
				res.json({ message: 'ok' });
			});
		});
	});
});

const nodemailer = require('nodemailer');
let id = '';
let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		type: 'OAuth2',
		user: process.env.USER_EMAIL,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		refreshToken: process.env.REFRESH_TOKEN,
		accessToken: process.env.ACCESS_TOKEN,
		expires: parseInt(process.env.EXPIRY_DURATION)
	}
});

router.post('/resetemail', (req, res) => {
	Account.findOne({ email: req.body.data.email }, (err, account) => {
		if (err) return res.status(500).json({ message: 'Erreur survenue. Veuillez reésayer.' });
		if (!account)
			return res.status(400).json({ message: 'Aucun compte associé à cet e-mail. Veuillez créer un compte.' });
	});
	id = new mongoose.Types.ObjectId();
	const mailOptions = {
		from: process.env.USER_EMAIL,
		to: req.body.data.email,
		subject: 'Express Money, Code de récupération de mot de passe.',
		text: `Code: ${id}`
	};

	transporter.sendMail(mailOptions, function(err, info) {
		if (err) {
			console.log(err);
			res.status(500).json({ message: 'Erreur survenue. Veuillez reéssayer.' });
		} else {
			res.json({ message: 'ok' });
		}
	});
});

router.post('/resetcode', (req, res) => {
	if (JSON.stringify(id) !== JSON.stringify(req.body.data.code.trim()))
		return res.status(400).json({ message: 'Code incorrect.' });
	res.json({ message: 'ok' });
	id = new mongoose.Types.ObjectId();
	id = new mongoose.Types.ObjectId();
});

router.post('/resetpass', (req, res) => {
	if (req.body.data.pwd !== req.body.data.confirmedPWD)
		return res.status(400).json({ message: 'Mots de passe différents.' });
	Account.findOne({ email: req.body.data.email }, async (err, account) => {
		if (err) return res.status(500).json({ message: 'Erreur survenue. Veuillez reésayer.' });
		if (!account)
			return res.status(400).json({ message: 'Aucun compte associé à cet e-mail. Veuillez créer un compte.' });
		const hashedPassword = await bcrypt.hash(req.body.data.pwd, parseInt(process.env.BCRYPT_WORK_FACTOR));
		account.pwd = hashedPassword;
		await account.save();
		res.json({ message: 'ok' });
	});
});

const accountValidationSchema = Joi.object({
	fname: Joi.string().min(2).max(40).required(),
	lname: Joi.string().min(2).max(40).required(),
	tel: Joi.string().required(),
	email: Joi.string().email().required(),
	pwd: Joi.string().min(4).required(),
	confirmedPWD: Joi.string().min(4).required(),
	_csrf: Joi.string()
});

const validateAccountInformations = (infos) => {
	const { error } = accountValidationSchema.validate(infos);
	if (error) return error.details[0].message;
	return null;
};

module.exports = router;
