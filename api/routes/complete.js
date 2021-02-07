const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const appRoot = require('app-root-path');
const Account = require('../models/Account.js');
const router = express.Router();
const bcrypt = require('bcryptjs');

const ensureAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).end();
};

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

router.post('/', ensureAuthentication, (req, res) => {
	if (req.user.accountRegistrationCode !== "") {
		return res.status(403).json({
			message: "Votre compte n'a pas été vérifié. Veuillez cliquez sur le lien envoyé à votre adresse mail."
		});
	}
	upload(req, res, (err) => {
		if (err instanceof multer.MulterError) {
			const filesErrorMessage = `Format supporté: PDF|JPEG|JPG, taille max: 4MB`;
			return res.status(400).json({ message: filesErrorMessage });
		} else if (err) {
			return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
		}
		Account.findOne({ tel: req.user.tel, isAccountValidated: { $ne: 'Validé' } }, async (err, account) => {
			if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
			if (!account) {
				return res.redirect('/operations');
			}
			const passwordsDoMatch = await bcrypt.compare(req.body.pwd, account.pwd);
			if (!passwordsDoMatch) return res.status(403).json({ message: 'Mot de passe incorrect' });

			deleteOldFiles(account.idUri, account.wcardUri, account.codcUri);

			account.city = req.body.city;
			account.rib = req.body.rib;
			account.idUri = uris[0];
			account.wcardUri = uris[1];
			account.codcUri = uris[2];
			account.isAccountValidated = 'En attente';
			uris = [];

			account.save((err, result) => {
				if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
				if (result) {
					res.json({ message: 'ok' });
				}
			});
		});
	});
});

module.exports = router;

const deleteOldFiles = async (idUri, wcardUri, codcUri) => {
	if (!idUri || !wcardUri || !codcUri) return;
	try {
		if (fs.existsSync(appRoot + '/dossiers/' + idUri)) fs.unlinkSync(appRoot + '/dossiers/' + idUri);
	} catch (err) {
		console.error(err);
	}
	try {
		if (fs.existsSync(appRoot + '/dossiers/' + wcardUri)) fs.unlinkSync(appRoot + '/dossiers/' + wcardUri);
	} catch (err) {
		console.error(err);
	}
	try {
		if (fs.existsSync(appRoot + '/dossiers/' + codcUri)) fs.unlinkSync(appRoot + '/dossiers/' + codcUri);
	} catch (err) {
		console.error(err);
	}
};
