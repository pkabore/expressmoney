const express = require('express');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const appRoot = require('app-root-path');
const Account = require("../models/Account.js");
const router = express.Router();
const bcrypt = require('bcryptjs');

const ensureAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) { return next() }
    res.redirect('/login');
}

router.get('/complete', ensureAuthentication, async (req, res, next) => {
    Account.findOne({ tel: req.user.tel }, (err, account) => {
        if (err) { return next(err); }
        if (!account) { return res.redirect('/operations'); }
        if (account.isAccountValidated === "Confirmé") { return res.redirect('/profile'); }
        res.render(__dirname + '/../views/complete', { account: req.user, _csrf: req.csrfToken(), errorMessage: req.flash('errorMessage')[0] });
    })
})

router.post('/complete', ensureAuthentication, (req, res, next) => {
    let form = formidable({ multiples: true });
    Account.findOne({ tel: req.user.tel, isAccountValidated: {$ne : "Confirmé"} }, (err, account) => {
        if (err) { return next(err); }
        if (!account) { return res.redirect('/operations'); }
        form.parse(req, async (err, fields, files, next) => {
            if (err) { return next(err); }
            const passwordsDoMatch = await bcrypt.compare(fields.pwd, account.pwd);
            if (!passwordsDoMatch) {
                return res.render(__dirname + "/../views/complete", {
                    errorMessage: "Mot de passe incorrect",
                    account: req.user,
                    _csrf: req.csrfToken()
                });
            }
            const filesErrorMessage = `Format supporté: PDF|JPEG|JPG, taille max: 4MB`;

            if (err || !checkFiles(files))
                return res.render(__dirname + "/../views/complete", {
                    errorMessage: filesErrorMessage,
                    _csrf: req.csrfToken()
                });
            deleteOldFiles(account.idUri, account.wcardUri, account.codcUri);
            
            const idfile = new mongoose.Types.ObjectId() + path.extname(files.id.name);
            const wcardfile = new mongoose.Types.ObjectId()  + path.extname(files.wcard.name);
            const codcfile = new mongoose.Types.ObjectId() + path.extname(files.codc.name);

            fs.renameSync(files.id.path, appRoot + '/dossiers/' + idfile);
            fs.renameSync(files.wcard.path, appRoot + '/dossiers/' + wcardfile);
            fs.renameSync(files.codc.path, appRoot + '/dossiers/' + codcfile);

            account.city = fields.city;
            account.rib = fields.rib;
            account.idUri = idfile;
            account.wcardUri = wcardfile;
            account.codcUri = codcfile;
            account.isAccountValidated = "En attente";

            account.save((err, result) => {
                if (err) { return next(err); }
                if (result) { req.flash('accountCompletion', true); res.redirect('/operations'); }
            });
        })
    });
})

module.exports = router;

const checkFiles = (files) => {

    const maxSize = parseInt(process.env.FILE_MAX_SIZE);

    if (!files.id.name || !files.wcard.name || !files.codc.name) return false;
    if (!files.id.type.includes('image/') && !files.id.type.includes('application/pdf')) return false;
    if (!files.wcard.type.includes('image/') && !files.wcard.type.includes('application/pdf')) return false;
    if (!files.codc.type.includes('image/') && !files.codc.type.includes('application/pdf')) return false;
    if (files.id.size > maxSize || files.wcard.size > maxSize || files.codc.size > maxSize) return false;

    return true;
}

const deleteOldFiles = (idUri, wcardUri, codcUri) => {
    if (!idUri || !wcardUri || !codcUri)
        return;
    fs.unlinkSync(appRoot + '/dossiers/' + idUri);   
    fs.unlinkSync(appRoot + '/dossiers/' + wcardUri);   
    fs.unlinkSync(appRoot + '/dossiers/' + codcUri);   
}