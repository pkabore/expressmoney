const express = require('express');
const Account = require('../models/Account.js');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const multer = require('multer');
const router = express.Router();
const authenticator = require('otplib').authenticator;
const utils = require('../utils/utilities');

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
					html: utils.getEmailHtml('Cliquez', verificationToken)
				};
				utils.transporter.sendMail(mailOptions, async (err, info) => {
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

router.put('/update', ensureAuthentication, (req, res) => {
	/**
	* Multer configuration for files upload
	*/
	let uris = [];
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, appRoot + '/dossiers');
		},
		filename: (req, file, cb) => {
			const id = new mongoose.Types.ObjectId() + path.extname(file.originalname);
			uris.push(id);
			cb(null, id);
		}
	});
	let upload = multer({
		storage,
		fileFilter: (req, file, cb) => {
			const maxSize = parseInt(process.env.FILE_MAX_SIZE);
			if (!file.mimetype.includes('image/') && !file.mimetype.includes('application/pdf')) return cb(null, false);
			if (file.size > maxSize) return cb(null, false);
			cb(null, true);
		}
	});
	upload = upload.array('papers', 3);
	/**------------------------------------------------------------------ */
	Account.findOne({ email: req.user.email }, async (err, doc) => {
		if (err || !doc) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
		let hashedPassword = '';
		if (req.body.name === '' || req.body.email === '' || req.body.tel === '' || req.body.city === '')
			return res.status(400).json({ message: 'Veuillez renseigner touts les champs nécessaires.' });
		try {
			if (req.body.pwd !== '') {
				if (req.body.pwd.length < 4)
					return res.status(400).json({ message: 'Mots de passe courts. Min (4 charactères)' });
				if (!await bcrypt.compare(req.body.oldPWD, doc.pwd))
					return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });
				if (req.body.pwd !== req.body.confirmedPWD)
					return res.status(400).json({ message: 'Mots de passe différents' });
				hashedPassword = await bcrypt.hash(req.body.pwd, parseInt(process.env.BCRYPT_WORK_FACTOR));
				doc.pwd = hashedPassword;
			}
			upload(req, res, async (err) => {
				if (err instanceof multer.MulterError) {
					const filesErrorMessage = `Format supporté: PDF|JPEG|JPG, taille max: 4MB`;
					return res.status(400).json({ message: filesErrorMessage });
				} else if (err) {
					return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
				}
				if (doc.isAccountValidated === '' && uris.length < 3)
					return res.status(400).json({ message: 'Fichiers incomplets' });
				const uploadingFiles = doc.uploadingFile.split(' ');
				if (doc.isAccountValidated === 'Déclliné' && uploadingFiles.length < 3)
					return res.status(400).json({ message: 'Fichiers incomplets' });
				utils.deleteOldFiles(account.idUri, account.wcardUri, account.codcUri);
				doc.name = req.body.name;
				doc.email = req.body.email;
				doc.tel = req.body.tel;
				doc.city = req.body.city;
				if (doc.isAccountValidated === 'Décliné' || uris.length > 0) {
					if (uploadingFiles.length === 3 || uris.length === 3) {
						doc.idUri = uris[0];
						doc.wcardUri = uris[1];
						doc.codcUri = uris[2];
					} else {
						if (uploadingFiles.includes('id')) doc.idUri = uris[0];
						if (uploadingFiles.includes('wcard')) doc.wcardUri = uris[1];
						if (uploadingFiles.includes('codc')) doc.codcUri = uris[2];
					}
				}
				await doc.save();
				res.json({ message: 'ok' });
			});
		} catch (error) {
			return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
		}
	});
});

router.get('/verification/:id', (req, res) => {
	Account.findOne({ accountRegistrationCode: req.params.id }, async (err, account) => {
		if (err) return res.status(500).json({ message: 'Erreur survenue. Veuillez reéssayer.' });
		if (!account) return res.status(400).json({ message: 'Code invalide ou déjà utilisé' });
		try {
			account.accountRegistrationCode = '';
			await account.save();
			res.json({ message: 'ok' });
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
			html: utils.getEmailHtml('Code de récupération de mot de passe:', token)
		};

		utils.transporter.sendMail(mailOptions, function(err, info) {
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
	utils.transporter.sendMail(mailOptions, async (err, info) => {
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
	city: Joi.string().required(),
	email: Joi.string().email().required(),
	pwd: Joi.string().min(4).required(),
	confirmedPWD: Joi.string().min(4).required()
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

module.exports = router;
