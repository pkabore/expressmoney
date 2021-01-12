const express = require("express");
const { randomBytes } = require("crypto");
const Operation = require("../models/Operation.js");
const Account = require("../models/Account.js");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

router.get("/", async (req, res, next) => {
	let mquery = {};
	mquery.sender_id = req.user._id;
	if (req.query.q && req.query.q !== "") mquery.status = req.query.q;
	Operation.find(mquery, (err, operations) => {
		if (err) {
			return next(err);
		}
		let data = {};
		data.operations = operations;
		data.account = req.user;
		// data.successMessage = req.flash('successMessage')[0];
		// data.errorMessage = req.flash('errorMessage')[0];
		// data.accountCompletion = req.flash('accountCompletion')[0];
		// if (req.query.q === "En cours") data.isActivePending = "is-active";
		// else if (req.query.q === "Réussi") data.isActiveSucceeded = "is-active";
		// else if (req.query.q === "Non validé")
		// 	data.isActiveCancelled = "is-active";
		// else data.isActiveAll = "is-active";
		return res.json(operations);
	});
});

router.get("/request", (req, res) => {
	if (req.user.isAccountValidated === "Confirmé") {
		res.render(__dirname + "/../views/request", {
			account: req.user,
			_csrf: req.csrfToken()
		});
	} else if (req.user.isAccountValidated === "") {
		req.flash(
			"errorMessage",
			"Veuillez compléter ces informations pour faire la demande."
		);
		return res.redirect("/complete");
	} else {
		req.flash(
			"errorMessage",
			"Votre compte est en cours de vérification et pas encore validé pour effectuer une opération"
		);
		return res.redirect("/operations");
	}
});

router.post("/request", async (req, res, next) => {
	// if (req.user.isAccountValidated === "") {
	// 	res.locals.errorMessage =
	// 		"Veuillez compléter ces informations pour faire la demande.";
	// 	return res.redirect("/complete");
	// }
	Account.findById(req.user._id)
		.select("pwd name")
		.exec((err, account) => {
			if (err) {
				return next(err);
			}
			bcrypt.compare(
				req.body.pwd,
				account.pwd,
				(bcrypt_err, bcrypt_res) => {
					if (bcrypt_err) {
						return next(err);
					}
					if (!bcrypt_res) {
						const data = { errorMessage: "Mot de passe incorrect" };
						return res.json(data);
					}
					const operation = new Operation({
						sender_id: new mongoose.Types.ObjectId(account._id),
						amount: req.body.amount,
						currency: req.body.currency,
						sender: account.name,
						rname: req.body.rname,
						rnumber: req.body.rphone
					});
					operation.save((err, result) => {
						if (err)
							return res.status(500).json({ message: "Failure" });
						return res.json({ message: "ok" });
					});
				}
			);
		});
});

module.exports = router;
