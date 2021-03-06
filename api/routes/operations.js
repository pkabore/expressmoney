const express = require('express');
const Operation = require('../models/Operation.js');
const Account = require('../models/Account.js');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const authenticator = require('otplib').authenticator;
const utils = require('../utils/utilities');

const ensureAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).end();
};

router.get('/', ensureAuthentication, async (req, res, next) => {
	let mquery = {};
	mquery.sender_id = req.user._id;
	if (req.query.q && req.query.q !== '') mquery.status = req.query.q;
	Operation.find(mquery, (err, operations) => {
		if (err) return res.status(500).json({ message: 'Erreur technique survenue!' });
		return res.json(operations);
	});
});

router.put('/:id', ensureAuthentication, async (req, res) => {
	Operation.findById(new mongoose.Types.ObjectId(req.params.id), (err, operation) => {
		if (err) return res.status(500).json({ message: 'Erreur technique survenue!' });
		if (!operation) return res.status(404).json({ message: 'Échec! Opération non existante' });
		if (operation.status === 'Réussi')
			return res.status(400).json({ message: 'Modification échouée: opération déjà effectuée!' });
		Account.findOne({ tel: req.user.tel }, async (err, account) => {
			if (err) return res.status(500).json({ message: 'Erreur technique survenue!' });
			if (!account) return res.status(500).json({ message: 'Erreur technique survenue!' });
			try {
				const passwordsDoMatch = await bcrypt.compare(req.body.pwd, account.pwd);
				if (!passwordsDoMatch) return res.status(403).json({ message: 'Mot de passe incorrect' });
			} catch (err) {
				return res.status(500).json({ message: 'Erreur technique survenue!' });
			}
			if (
				parseFloat(req.body.amount) < parseFloat(process.env.SOMME_MIN) ||
				parseFloat(req.body.amount) > parseFloat(process.env.SOMME_MAX)
			)
				return res.status(400).json({
					message: `Veuillez choisir un montant compris entre ${process.env.SOMME_MIN} et ${process.env
						.SOMME_MAX}`
				});
			if (
				parseFloat(req.body.amount) + account.totalRequestedAmount - operation.amount >
				parseFloat(process.env.REQUEST_LIMIT_AMOUNT)
			)
				return res.status(400).json({
					message: `Limite du montant mensuel atteint. Veuillez choisir un montant inférieur ou attendez de payer touts vos frais avant de procéder.`
				});
			const oldLimit = operation.amount;
			operation.amount = req.body.amount;
			operation.sender = account.name;
			operation.fees = new Number(parseFloat(req.body.amount) * parseFloat(process.env.RATE)).toFixed(3);
			operation.rname = req.body.rfname + ' ' + req.body.rlname;
			operation.rnumber = req.body.rnumber;

			try {
				account.totalRequestedAmount = account.totalRequestedAmount + parseFloat(operation.amount) - oldLimit;
				await account.save();
				await operation.save();
				return res.json({ message: 'ok' });
			} catch (error) {
				return res.status(500).json({ message: 'Erreur technique survenue!' });
			}
		});
	});
});

/** Delete an operation */
router.post('/delete/:id', ensureAuthentication, async (req, res) => {
	Operation.findById(new mongoose.Types.ObjectId(req.params.id), (err, operation) => {
		if (err) return res.status(500).json({ message: 'Erreur technique survenue!' });
		if (!operation) return res.status(404).json({ message: 'Échec! Opération non existante' });
		if (operation.status === 'Réussi')
			return res.status(400).json({ message: 'Annulation échouée: opération déjà effectuée!' });
		Account.findOne({ tel: req.user.tel }, async (err, account) => {
			if (err) return res.status(500).json({ message: 'Erreur technique survenue!' });
			if (!account) return res.status(500).json({ message: 'Erreur technique survenue!' });
			try {
				const passwordsDoMatch = await bcrypt.compare(req.body.pwd, account.pwd);
				if (!passwordsDoMatch) return res.status(403).json({ message: 'Mot de passe incorrect' });
			} catch (err) {
				return res.status(500).json({ message: 'Erreur technique survenue!' });
			}
			try {
				account.totalRequestedAmount -= operation.amount;
				await account.save();
				await operation.deleteOne();
				return res.json({ message: 'ok' });
			} catch (error) {
				return res.status(500).json({ message: 'Erreur technique survenue!' });
			}
		});
	});
});

router.post('/request/code', ensureAuthentication, async (req, res) => {
	Account.findOne({ _id: req.user._id, isAccountValidated: 'Validé' }, async (err, account) => {
		if (err || !account) return res.status(500).json({ message: 'Erreur technique survenue!' });

		if (parseFloat(req.body.amount) + account.totalRequestedAmount > parseFloat(process.env.REQUEST_LIMIT_AMOUNT))
			return res.status(400).json({
				message:
					'Limite du montant mensuel atteint. Veuillez choisir un montant inférieur ou attendez de payer touts vos frais avant de procéder.'
			});
		const secret = authenticator.generateSecret();
		const token = authenticator.generate(secret);
		account.operationConfirmationCode = token;
		account.operationConfirmationCodeExpires = 60 * 60 * 1000 + new Date().getTime();
		try {
			await account.save();
		} catch (error) {
			return res.status(500).json({ message: 'Erreur technique survenue!' });
		}

		const mailOptions = {
			from: process.env.USER_EMAIL,
			to: req.user.email,
			subject: 'Demande de crédit Express Money.',
			html: utils.getEmailHtml('Code de confirmation pour votre demande de crédit:', token)
		};
		utils.transporter.sendMail(mailOptions, async (err, info) => {
			if (err) {
				account.operationConfirmationCode = new mongoose.Types.ObjectId();
				await account.save();
				res.status(500).json({ message: 'Envoi du code à votre email échoué. Veuillez réessayer.' });
			} else {
				res.json({ message: 'ok' });
			}
		});
	});
});

router.post('/request', ensureAuthentication, async (req, res) => {
	Account.findOne({ _id: req.user._id, isAccountValidated: 'Validé' }, (err, account) => {
		if (err) return res.status(500).json({ message: 'Erreur technique survenue!' });

		bcrypt.compare(req.body.pwd, account.pwd, async (bcrypt_err, bcrypt_res) => {
			if (bcrypt_err) return res.status(500).json({ message: 'Erreur technique survenue!' });
			if (!bcrypt_res) return res.status(400).json({ message: 'Mot de passe incorrect' });
			if (
				account.operationConfirmationCode !== req.body.code ||
				account.operationConfirmationCodeExpires < new Date().getTime()
			)
				return res.status(400).json({ message: 'Code invalide ou expiré.' });
			if (
				parseFloat(req.body.amount) < parseFloat(process.env.SOMME_MIN) ||
				parseFloat(req.body.amount) > parseFloat(process.env.SOMME_MAX)
			)
				return res.status(400).json({
					message: `Veuillez choisir un montant compris entre ${process.env.SOMME_MIN} et ${process.env
						.SOMME_MAX}`
				});
			if (
				parseFloat(req.body.amount) + account.totalRequestedAmount >
				parseFloat(process.env.REQUEST_LIMIT_AMOUNT)
			)
				return res.status(400).json({
					message: `Limite du montant mensuel atteint. Veuillez choisir un montant inférieur ou attendez de payer touts vos frais avant de procéder.`
				});
			const operation = new Operation({
				sender_id: new mongoose.Types.ObjectId(account._id),
				sender_email: req.user.email,
				amount: req.body.amount,
				sender: account.name,
				fees: new Number(parseFloat(req.body.amount) * parseFloat(process.env.RATE)).toFixed(3),
				rname: req.body.rfname + ' ' + req.body.rlname,
				rnumber: req.body.rnumber

			});
			try {
				account.totalRequestedAmount += parseFloat(operation.amount);
				await account.save();
				await operation.save();
				return res.json({ message: 'ok' });
			} catch (error) {
				return res.status(500).json({ message: 'Erreur technique survenue!' });
			}
		});
	});
});

module.exports = router;
