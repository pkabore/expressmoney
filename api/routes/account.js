const express = require('express');
const Account = require('../models/Account.js');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

const ensureAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).end();
};

/*-------------------------account routes------------------------------*/
router.get('/account', ensureAuthentication, (req, res) => {
	Account.findOne({ tel: req.user.tel }).select('-pwd -tel -rib').exec((err, profile) => {
		if (err) {
			return res.status(500).end();
		}
		return res.json(profile);
	});
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(400).json(info);
		}
		req.logIn(user, (err) => {
			if (err) {
				return next(err);
			}
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
	Account.findOne({ tel }).select('tel').exec((err, doc) => {
		if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
		if (doc) return res.status(400).json({ err: 'Numéro déjà utilisé. Veuillez vous connecter.' });
		const fieldsValidationResult = validateAccountInformations(req.body.data);
		if (fieldsValidationResult) return res.status(400).json({ err: fieldsValidationResult });
		if (req.body.data.pwd !== req.body.data.confirmedPWD)
			return res.status(400).json({ err: 'Mots de passe différents' });
		bcrypt.hash(req.body.data.pwd, parseInt(process.env.BCRYPT_WORK_FACTOR), (bcrypt_err, hashedPassword) => {
			if (bcrypt_err) return res.status(500).json({ err: 'Erreur survenue. Veuillez reéssayer.' });
			const account = new Account({
				name: req.body.data.fname + ' ' + req.body.data.lname,
				tel: req.body.data.tel,
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

const accountValidationSchema = Joi.object({
	fname: Joi.string().min(2).max(40).required(),
	lname: Joi.string().min(2).max(40).required(),
	tel: Joi.string().required(),
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
