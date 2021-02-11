const express = require('express');
const Account = require('../models/Account.js');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const router = express.Router();
const authenticator = require('otplib').authenticator;
const mjml2html = require('mjml');

const ensureAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).end();
};

const nodemailer = require('nodemailer');
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
	const tel = req.body.tel;
	const email = req.body.email;
	Account.findOne({ $or: [ { tel }, { email } ] }, (err, doc) => {
		if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
		if (doc) return res.status(400).json({ message: 'Numéro ou e-mail déjà utilisé. Veuillez vous connecter.' });
		const fieldsValidationResult = validateAccountInformations(req.body.data);
		if (fieldsValidationResult) return res.status(400).json({ message: fieldsValidationResult });
		if (req.body.pwd !== req.body.confirmedPWD)
			return res.status(400).json({ message: 'Mots de passe différents' });
		bcrypt.hash(req.body.pwd, parseInt(process.env.BCRYPT_WORK_FACTOR), async (bcrypt_err, hashedPassword) => {
			if (bcrypt_err) return res.status(500).json({ message: 'Erreur survenue. Veuillez reéssayer.' });
			const verificationToken = new mongoose.Types.ObjectId() + new mongoose.Types.ObjectId();

			const account = new Account({
				name: req.body.fname + ' ' + req.body.lname,
				tel: req.body.tel,
				email: req.body.email,
				isAccountValidated: '',
				pwd: hashedPassword,
				accountRegistrationCode: verificationToken
			});
			account.save((mongoose_err, result) => {
				if (mongoose_err)
					return res.status(500).json({
						message: 'Erreur survenue. Veuillez reéssayer.'
					});
				const mailOptions = {
					from: process.env.USER_EMAIL,
					to: req.body.email,
					subject: 'Vérification de votre compte Express Money.',
					html: getEmailHtml('Cliquez', verificationToken)
				};
				transporter.sendMail(mailOptions, async (err, info) => {
					if (err) {
						console.log(err);
						await account.delete();
						res.status(500).json({ message: 'Erreur survenue. Veuillez reéssayer.' });
					} else {
						res.json({ message: 'ok' });
					}
				});
			});
		});
	});
});

router.get('/verification/:id', (req, res) => {
	Account.findOne({ accountRegistrationCode: id }, async (err, account) => {
		if (err || !account) return res.status(500).json({ message: 'Erreur survenue. Veuillez reéssayer.' });
		account.accountRegistrationCode = '';
		try {
			await account.save();
			res.redirect('/credit');
		} catch (error) {
			res.status(500).json({ message: 'Erreur survenue. Veuillez reéssayer.' });
		}
	});
});

router.post('/resetemail', (req, res) => {
	Account.findOne({ email: req.body.email }, async (err, account) => {
		if (err) return res.status(500).json({ message: 'Erreur survenue. Veuillez reésayer.' });
		if (!account)
			return res.status(400).json({ message: 'Aucun compte associé à cet e-mail. Veuillez créer un compte.' });

		const secret = authenticator.generateSecret();
		const token = authenticator.generate(secret);
		try {
			account.passwordResetCode = token;
			await account.save();
		} catch (error) {
			return res.status(500).json({ message: 'Erreur survenue. Veuillez reésayer.' });
		}
		const mailOptions = {
			from: '<no-reply>@expressmoney.com',
			to: req.body.email,
			subject: 'Express Money, Mot de passe oublié ',
			text: `Code: ${token}`,
			html: getEmailHtml('Code de récupération de mot de passe:', token)
		};

		transporter.sendMail(mailOptions, function(err, info) {
			if (err) {
				console.log(err);
				res.status(500).json({ message: "Echec d'envoi de code à votre adresse email. Veuillez reéssayer." });
			} else {
				res.json({ message: 'ok' });
			}
		});
	});
});

router.post('/resetcode', (req, res) => {
	Account.findOne({ email: req.body.email }, async (err, account) => {
		if (err) return res.status(500).json({ message: 'Erreur survenue. Veuillez reésayer.' });
		if (JSON.stringify(account.passwordResetCode) !== JSON.stringify(req.body.code.trim()))
			return res.status(400).json({ message: 'Code incorrect.' });
		res.json({ message: 'ok' });
	});
});

router.post('/resetpass', (req, res) => {
	if (req.body.pwd !== req.body.confirmedPWD) return res.status(400).json({ message: 'Mots de passe différents.' });
	Account.findOne({ email: req.body.email }, async (err, account) => {
		if (err) return res.status(500).json({ message: 'Erreur survenue. Veuillez reésayer.' });
		if (!account)
			return res.status(400).json({ message: 'Aucun compte associé à cet e-mail. Veuillez créer un compte.' });
		const hashedPassword = await bcrypt.hash(req.body.pwd, parseInt(process.env.BCRYPT_WORK_FACTOR));
		account.pwd = hashedPassword;
		await account.save();
		res.json({ message: 'ok' });
	});
});

router.post('/email', (req, res) => {
	const messageValidation = validateEmailInformations(req.body);
	if (messageValidation) return res.status(400).json({ message: messageValidation });
	const mailOptions = {
		from: req.body.email,
		to: process.env.USER_EMAIL,
		subject: req.body.subject,
		text: req.body.message
	};
	transporter.sendMail(mailOptions, async (err, info) => {
		if (err) {
			console.log(err);
			res.status(500).json({ message: 'Erreur survenue. Veuillez reéssayer.' });
		} else {
			res.json({ message: 'ok' });
		}
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

const emailValidationSchema = Joi.object({
	subject: Joi.string().required(),
	message: Joi.string().required(),
	email: Joi.string().email().required()
});

const validateAccountInformations = (infos) => {
	const { error } = accountValidationSchema.validate(infos);
	if (error) return error.details[0].message;
	return null;
};

const validateEmailInformations = (infos) => {
	const { error } = emailValidationSchema.validate(infos);
	if (error) return error.details[0].message;
	return null;
};

const getEmailHtml = (subject, code) => {
	const link = `${process.env.BASE_URL}/verification/${code}`;
	let message = `
		<mjml>
			<mj-head>
				<mj-font name="Raleway"
       href="https://fonts.googleapis.com/css?family=Raleway" />
			</mj-head>
			<mj-body>
				<mj-section>
					<mj-column>
						<mj-text font-size="25px" align="center" color="#1976d2" font-weight="bold" font-family="Raleway, Arial, cursive">Express Money, Service Client</mj-text>
						<mj-divider border-color="#1976d2"></mj-divider>`;
	if (subject.includes('Cliquez'))
		message += `<mj-button font-family="Raleway, Arial, cursive" font-size="20px" background-color="#1976d2" color="white" href=${link}>
						Cliquez ici pour vérifier votre compte
					</mj-button>`;
	else
		message += `<mj-text font-family="Raleway, Arial, cursive" font-size="20px" align="center" padding-top="35px">${subject} ${code}</mj-text>`;

	message += `</mj-column>
				</mj-section>
			</mj-body>
		</mjml>`;
	return mjml2html(message).html;
};

module.exports = router;
