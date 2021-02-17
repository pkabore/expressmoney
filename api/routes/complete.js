const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const appRoot = require('app-root-path');
const Account = require('../models/Account.js');
const router = express.Router();

const ensureAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).end();
};

router.post('/', ensureAuthentication, (req, res) => {
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
	Account.findOne({ tel: req.user.tel, isAccountValidated: { $ne: 'Validé' } }, async (err, account) => {
		if (account.accountRegistrationCode !== '')
			return res.status(403).json({
				message: "Votre compte n'a pas été vérifié. Veuillez cliquez sur le lien envoyé à votre adresse mail."
			});
		if (err) return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
		if (!account) {
			return res.redirect('/credit');
		}
		upload(req, res, async (err) => {
			if (err instanceof multer.MulterError) {
				const filesErrorMessage = `Format supporté: PDF|JPEG|JPG, taille max: 4MB`;
				return res.status(400).json({ message: filesErrorMessage });
			} else if (err) {
				return res.status(500).json({ message: 'Échec! Veuillez reésayer' });
			}

			if (uris.length < 3) return res.status(400).json({ message: 'Fichiers incomplets' });
			utils.deleteOldFiles(account.idUri, account.wcardUri, account.codcUri);

			account.city = req.body.city;
			account.rib = req.body.rib;
			account.idUri = uris[0];
			account.wcardUri = uris[1];
			account.codcUri = uris[2];
			account.isAccountValidated = 'En attente';
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
