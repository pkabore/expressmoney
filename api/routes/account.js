const express = require('express');
const Account = require('../models/Account.js');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const appRoot = require('app-root-path');
const router = express.Router();
const authenticator = require('otplib').authenticator;
const utils = require('../utils/utilities');
const jwt = require('jsonwebtoken');





/*----------------Google Drive API start ----------------*/


// const fs = require('fs');
// const readline = require('readline');
// const {google} = require('googleapis');

// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/drive'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = 'token.json';

// // Load client secrets from a local file.
// fs.readFile(__dirname + '/api/' + 'credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Drive API.
//   authorize(JSON.parse(content), listFiles);
// });

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(credentials, callback) {
//   const {client_secret, client_id, redirect_uris} = credentials.installed;
//   const oAuth2Client = new google.auth.OAuth2(
//       client_id, client_secret, redirect_uris[0]);

//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getAccessToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     callback(oAuth2Client);
//   });
// }

// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
// function getAccessToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }

// /**
//  * Lists the names and IDs of up to 10 files.
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// function listFiles(auth) {
//   const drive = google.drive({version: 'v3', auth});
//   drive.files.list({
//     pageSize: 10,
//     fields: 'nextPageToken, files(id, name)',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const files = res.data.files;
//     if (files.length) {
//       console.log('Files:');
//       files.map((file) => {
//         console.log(`${file.name} (${file.id})`);
//       });
//     } else {
//       console.log('No files found.');
//     }
//   });
// }


// var parentId = '';//some parentId of a folder under which to create the new folder

// var fileMetadata = {
//   'name' : 'New Folder',
//   'mimeType' : 'application/vnd.google-apps.folder',
//   'parents': [parentId]
// };

// google.drive.files.create({
//   resource: fileMetadata,
// }).then(function(response) {
//   switch(response.status){
//     case 200:
//       var file = response.result;
//       console.log('Created Folder Id: ', file.id);
//       break;
//     default:
//       console.log('Error creating the folder, '+response);
//       break;
//     }
// });


/*----------------Google Drive API start ----------------*/

const ensureAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).end();
};

/*-------------------------account routes------------------------------*/
router.get('/account', ensureAuthentication, (req, res) => {
	Account.findOne({ email: req.user.email }).select('-pwd -_id').exec((err, account) => {
		if (err) return res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
		return res.json(account);
	});
});

router.post('/delete', ensureAuthentication, (req, res) => {
	Account.findOne({ email: req.user.email }, async (err, account) => {
		if (err) return res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
		account.isAccountValidated = 'Suppression';
		await account.save();
		return res.json({ message: 'ok' });
	});
});

// router.post('/login', (req, res, next) => {
// 	passport.authenticate('local', (err, user, info) => {
// 		if (err) return next(err);
// 		if (!user) return res.status(400).json(info);
// 		req.logIn(user, (err) => {
// 			if (err) return next(err);
// 			return res.status(200).end();
// 		});
// 	})(req, res, next);
// });


// ...

router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'local',
      async (err, user, info) => {
        try {
          if (err || !user) {
            const error = new Error('Erreur survenue.');

            return next(error);
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);

              const body = {_id: user._id,
						name: user.name,
						tel: user.tel,
						email: user.email,
						isAccountValidated: user.isAccountValidated,
						isEmailVerified: user.accountRegistrationCode === '' ? true : false,
						uploadingFile: user.uploadingFile};
              const token = jwt.sign({ user: body }, process.env.SESSION_SECRET);

              return res.json({ token });
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);

module.exports = router;

router.post('/logout', (req, res) => {
	req.logout();
	res.json({ message: 'ok' });
});

router.post('/register', (req, res, next) => {
	const tel = req.body.tel;
	const email = req.body.email;
	Account.findOne({ $or: [ { tel }, { email } ] }, (err, doc) => {
		if (err) return res.status(500).json({ message: 'Erreur technique survenue!' });
		if (doc) return res.status(400).json({ message: 'Numéro ou e-mail déjà utilisé. Veuillez vous connecter.' });
		const fieldsValidationResult = validateAccountInformations(req.body.data);
		if (fieldsValidationResult) return res.status(400).json({ message: fieldsValidationResult });
		if (req.body.pwd !== req.body.confirmedPWD)
			return res.status(400).json({ message: 'Mots de passe différents' });
		bcrypt.hash(req.body.pwd, parseInt(process.env.BCRYPT_WORK_FACTOR), async (bcrypt_err, hashedPassword) => {
			if (bcrypt_err) return res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
			let verificationToken = '';
			verificationToken = await crypto.randomBytes(32);
			verificationToken = verificationToken.toString('hex');
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
						message: 'Erreur technique survenue! Veuillez reéssayer..'
					});
				const mailOptions = {
					from: process.env.USER_EMAIL,
					to: req.body.email,
					subject: 'Vérification de votre email',
					html: utils.getEmailHtml('Cliquez', verificationToken)
				};
				utils.transporter.sendMail(mailOptions, async (err, info) => {
					if (err) {
						console.log(err);
						await account.delete();
						res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
					} else {
						res.json({ message: 'ok' });
					}
				});
			});
		});
	});
});

router.post('/emailchallenge', async (req, res) => {
	let verificationToken = '';
	verificationToken = await crypto.randomBytes(32);
	verificationToken = verificationToken.toString('hex');
	const mailOptions = {
		from: process.env.USER_EMAIL,
		to: req.body.email,
		subject: 'Vérification de votre email',
		html: utils.getEmailHtml('Cliquez', verificationToken)
	};
	utils.transporter.sendMail(mailOptions, async (err, info) => {
		if (err) {
			console.log(err);
			res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
		} else {
			res.json({ message: 'ok' });
		}
	});
});

router.post('/emailchange', async (req, res) => {
	let verificationToken = '';
	verificationToken = await crypto.randomBytes(32);
	verificationToken = verificationToken.toString('hex');

	const mailOptions = {
		from: process.env.USER_EMAIL,
		to: req.body.email,
		subject: 'Vérification de votre email',
		html: utils.getEmailHtml('Cliquez', verificationToken)
	};
	utils.transporter.sendMail(mailOptions, async (err, info) => {
		if (err) {
			res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
		} else {
			let email = '';
			if (req.user) email = req.user.email;
			else email = req.body.email;
			Account.findOne({ email }, async (err, account) => {
				if (err || !account)
					return res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
				try {
					account.accountRegistrationCode = verificationToken;
					await account.save();
					res.json({ message: 'ok' });
				} catch (error) {
					res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
				}
			});
		}
	});
});

router.get('/verification/:id', (req, res) => {
	Account.findOne(
		{ $or: [ { accountRegistrationCode: req.params.id }, { emailChangeCode: req.params.id } ] },
		async (err, account) => {
			if (err) return res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
			if (!account) return res.status(400).json({ message: 'Code invalide ou déjà utilisé' });
			try {
				if (account.accountRegistrationCode !== '') account.accountRegistrationCode = '';
				else {
					account.emailChangeCode = '';
					account.email = account.tempoEmail;
					account.tempoEmail = '';
				}
				await account.save();
				res.json({ message: 'ok' });
			} catch (error) {
				res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
			}
		}
	);
});

router.post('/updatepassword', ensureAuthentication, (req, res) => {
	if (req.body.pwd !== req.body.confirmedPWD) return res.status(400).json({ message: 'Mots de passe différents.' });
	Account.findOne({ email: req.user.email }, async (err, account) => {
		if (err) return res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
		if (!account) return res.status(403).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
		const passwordsDoMatch = await bcrypt.compare(req.body.oldPWD, account.pwd);
		if (!passwordsDoMatch) return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });
		const hashedPassword = await bcrypt.hash(req.body.pwd, parseInt(process.env.BCRYPT_WORK_FACTOR));
		account.pwd = hashedPassword;
		await account.save();
		res.json({ message: 'ok' });
	});
});

router.post('/updateprofile', ensureAuthentication, (req, res) => {
	if (req.body.name === '' || req.body.email === '' || req.body.tel === '' || req.body.city === '')
		return res.status(400).json({ message: 'Veuillez remplir touts les champs necéssaires.' });
	Account.findOne({ email: req.user.email }, async (err, account) => {
		if (err) return res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
		if (!account) return res.status(403).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });

		account.name = req.body.name;
		account.tel = req.body.tel;
		account.city = req.body.city;
		account.secondaryEmail = req.body.email;
		let verificationToken = '';
		verificationToken = await crypto.randomBytes(32);
		verificationToken = verificationToken.toString('hex');
		if (req.body.email !== account.email) {
			const mailOptions = {
				from: process.env.USER_EMAIL,
				to: req.body.email,
				subject: 'Vérification de votre email',
				html: utils.getEmailHtml('Cliquez', verificationToken)
			};
			utils.transporter.sendMail(mailOptions, async (err, info) => {
				if (err) {
					res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
				} else {
					let email = '';
					if (req.user) email = req.user.email;
					else email = req.body.email;
					Account.findOne({ email }, async (err, account) => {
						if (err || !account)
							return res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
						try {
							account.emailChangeCode = verificationToken;
							await account.save();
							res.json({
								message:
									"Veuillez cliquez sur le lien envoyé à l'adresse email: " +
									req.body.email +
									' pour la vérification.'
							});
						} catch (error) {
							res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
						}
					});
				}
			});
		} else {
			await account.save();
			res.json({ message: 'ok' });
		}
	});
});

router.post('/updatedossier', ensureAuthentication, async (req, res) => {
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

	/**------------------------------------------------------------------ */
	Account.findOne(
		{
			email: req.user.email
		},
		async (err, doc) => {
			if (err || !doc) return res.status(500).json({ message: 'Erreur technique survenue!' });
			if (doc.accountRegistrationCode !== '')
				return res.status(403).json({
					message:
						"Votre compte n'a pas été vérifié. Veuillez cliquez sur le lien envoyé à votre adresse mail."
				});
			if (doc.isAccountValidated === 'Suppression')
				return res.status(403).json({
					message: 'Votre compte est en cours de suppression. Mise à jour impossible.'
				});
			try {
				if (doc.isAccountValidated !== 'Validé') {
					upload = upload.array('papers', 3);
					upload(req, res, async (err) => {
						if (err instanceof multer.MulterError) {
							const filesErrorMessage = `Format supporté: PDF|JPEG|JPG, taille max: 4MB`;
							return res.status(400).json({ message: filesErrorMessage });
						} else if (err) {
							return res.status(500).json({ message: 'Erreur technique survenue!' });
						}
						if (uris.length < 3) return res.status(400).json({ message: 'Fichiers incomplets' });
						utils.deleteOldFiles(doc.idUri, doc.wcardUri, doc.codcUri);
						doc.idUri = uris[0];
						doc.wcardUri = uris[1];
						doc.codcUri = uris[2];
						doc.city = req.body.city;
						doc.isAccountValidated = 'En attente';
						await doc.save();
						res.json({ message: 'ok' });
					});
				} else {
					doc.city = req.body.city;
					await doc.save();
					res.json({ message: 'ok' });
				}
			} catch (error) {
				return res.status(500).json({ message: 'Erreur technique survenue!' });
			}
		}
	);
});

router.post('/resetemail', (req, res) => {
	Account.findOne({ email: req.body.email }, async (err, account) => {
		if (err) return res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
		if (!account)
			return res.status(400).json({ message: 'Aucun compte associé à cet e-mail. Veuillez créer un compte.' });

		const secret = authenticator.generateSecret();
		const token = authenticator.generate(secret);
		try {
			account.passwordResetCode = token;
			account.passwordResetCodeExpires = 60 * 60 * 1000 + new Date().getTime();
			await account.save();
		} catch (error) {
			return res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer.' });
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
				res.status(500).json({ message: "Echec d'envoi de code à votre adresse email. Veuillez réessayer." });
			} else {
				res.json({ message: 'ok' });
			}
		});
	});
});

router.post('/resetcode', (req, res) => {
	Account.findOne(
		{
			email: req.body.email,
			passwordResetCode: req.body.code,
			passwordResetCodeExpires: { $gte: new Date().getTime() }
		},
		async (err, account) => {
			if (err) return res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
			if (!account || JSON.stringify(account.passwordResetCode) !== JSON.stringify(req.body.code.trim()))
				return res.status(400).json({ message: 'Code de changement de mot de passe expiré ou invalide.' });
			res.json({ message: 'ok' });
		}
	);
});

router.post('/resetpass', (req, res) => {
	if (req.body.pwd !== req.body.confirmedPWD) return res.status(400).json({ message: 'Mots de passe différents.' });
	Account.findOne(
		{
			email: req.body.email,
			passwordResetCode: req.body.code,
			passwordResetCodeExpires: { $gte: new Date().getTime() }
		},
		async (err, account) => {
			if (err) return res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
			if (!account)
				return res.status(400).json({ message: 'Code de changement de mot de passe expiré ou invalide.' });
			const hashedPassword = await bcrypt.hash(req.body.pwd, parseInt(process.env.BCRYPT_WORK_FACTOR));
			account.pwd = hashedPassword;
			account.passwordResetCode = '';
			account.passwordResetCodeExpires = new Date() - 10;
			await account.save();
			res.json({ message: 'ok' });
		}
	);
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
			res.status(500).json({ message: 'Erreur technique survenue! Veuillez reéssayer..' });
		} else {
			res.json({ message: 'ok' });
		}
	});
});

router.get('/csrf', (req, res) => {
	res.json({ token: req.csrfToken() });
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
