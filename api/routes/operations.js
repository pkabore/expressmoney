const express = require('express');
const Operation = require('../models/Operation.js');
const Account = require('../models/Account.js');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const authenticator = require('otplib').authenticator;
const mjml2html = require('mjml');

const ensureAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).end();
};

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

router.get('/', ensureAuthentication, async (req, res, next) => {
	let mquery = {};
	mquery.sender_id = req.user._id;
	if (req.query.q && req.query.q !== '') mquery.status = req.query.q;
	Operation.find(mquery, (err, operations) => {
		if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
		return res.json(operations);
	});
});

router.put('/:id', ensureAuthentication, async (req, res) => {
	Operation.findById(new mongoose.Types.ObjectId(req.params.id), (err, operation) => {
		if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
		if (!operation) return res.status(404).json({ message: 'Échec! Opération non existante' });
		if (operation.status === 'Réussi')
			return res.status(400).json({ message: 'Modification échouée: opération déjà effectuée!' });
		Account.findOne({ tel: req.user.tel }, async (err, account) => {
			if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
			if (!account) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
			try {
				const passwordsDoMatch = await bcrypt.compare(req.body.pwd, account.pwd);
				if (!passwordsDoMatch) return res.status(403).json({ message: 'Mot de passe incorrect' });
			} catch (err) {
				return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
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
				return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
			}
		});
	});
});

/** Delete an operation */
router.post('/delete/:id', ensureAuthentication, async (req, res) => {
	Operation.findById(new mongoose.Types.ObjectId(req.params.id), (err, operation) => {
		if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
		if (!operation) return res.status(404).json({ message: 'Échec! Opération non existante' });
		if (operation.status === 'Réussi')
			return res.status(400).json({ message: 'Annulation échouée: opération déjà effectuée!' });
		Account.findOne({ tel: req.user.tel }, async (err, account) => {
			if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
			if (!account) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
			try {
				const passwordsDoMatch = await bcrypt.compare(req.body.pwd, account.pwd);
				if (!passwordsDoMatch) return res.status(403).json({ message: 'Mot de passe incorrect' });
			} catch (err) {
				return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
			}
			try {
				account.totalRequestedAmount -= operation.amount;
				await account.save();
				await operation.deleteOne();
				return res.json({ message: 'ok' });
			} catch (error) {
				return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
			}
		});
	});
});

router.post('/request/code', ensureAuthentication, async (req, res) => {
	Account.findOne({ _id: req.user._id, isAccountValidated: 'Validé' }, async (err, account) => {
		if (err || !account) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });

		if (parseFloat(req.body.amount) + account.totalRequestedAmount > parseFloat(process.env.REQUEST_LIMIT_AMOUNT))
			return res.status(400).json({
				message:
					'Limite du montant mensuel atteint. Veuillez choisir un montant inférieur ou attendez de payer touts vos frais avant de procéder.'
			});
		const secret = authenticator.generateSecret();
		const token = authenticator.generate(secret);
		account.operationConfirmationCode = token;
		try {
			await account.save();
		} catch (error) {
			return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
		}

		const mailOptions = {
			from: process.env.USER_EMAIL,
			to: req.user.email,
			subject: 'Demande de crédit Express Money.',
			html: getEmailHtml('Code de confirmation pour votre demande de crédit:', token)
		};
		transporter.sendMail(mailOptions, async (err, info) => {
			if (err) {
				console.log(err);
				account.operationConfirmationCode = new mongoose.Types.ObjectId();
				await account.save();
				res.status(500).json({ message: 'Envoi du code à votre email échoué. Veuillez reéssayer.' });
			} else {
				res.json({ message: 'ok' });
			}
		});
	});
});

router.post('/request', ensureAuthentication, async (req, res) => {
	Account.findOne({ _id: req.user._id, isAccountValidated: 'Validé' }, (err, account) => {
		if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });

		bcrypt.compare(req.body.pwd, account.pwd, async (bcrypt_err, bcrypt_res) => {
			if (bcrypt_err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
			if (!bcrypt_res) return res.status(400).json({ message: 'Mot de passe incorrect' });
			if (account.operationConfirmationCode !== req.body.code)
				return res.status(400).json({ message: 'Échec! Code invalide.' });
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
				console.log('something here ...');
				return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
			}
		});
	});
});

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
