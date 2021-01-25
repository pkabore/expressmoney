const express = require('express');
const Operation = require('../models/Operation.js');
const Account = require('../models/Account.js');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

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
		if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
		return res.json(operations);
	});
});

router.post('/request', ensureAuthentication, async (req, res, next) => {
	Account.findOne({ _id: req.user._id, isAccountValidated: 'Validé' }).select('pwd name').exec((err, account) => {
		if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
		bcrypt.compare(req.body.pwd, account.pwd, (bcrypt_err, bcrypt_res) => {
			if (bcrypt_err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
			if (!bcrypt_res) return res.status(400).json({ message: 'Mot de passe incorrect' });
			if (
				parseInt(req.body.amount) < parseInt(process.env.SOMME_MIN) ||
				parseInt(req.body.amount) > parseInt(process.env.SOMME_MAX)
			)
				return res.status(400).json({
					message: `Veuillez choisir un montant compris entre ${process.env.SOMME_MIN} et ${process.env
						.SOMME_MAX}`
				});
			const operation = new Operation({
				sender_id: new mongoose.Types.ObjectId(account._id),
				amount: req.body.amount,
				sender: account.name,
				//fees: parseInt(req.body.amount) * parseInt(process.env.RATE),
				rname: req.body.rfname + ' ' + req.body.rlname,
				rnumber: req.body.rnumber
			});
			operation.save((err, result) => {
				if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
				return res.json({ message: 'ok' });
			});
		});
	});
});

module.exports = router;
