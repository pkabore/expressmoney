'use strict';
/* This is a database connection function*/
const mongoose = require('mongoose');
const connection = {}; /* creating connection object*/

async function databaseConnection() {
	/* check if we have connection to our databse*/
	if (connection.isConnected) {
		return;
	}

	/* connecting to our database */
	await mongoose
		.connect(process.env.DATABASE_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		})
		.then((db) => {
			connection.isConnected = db.connections[0].readyState;
			console.log('Database connected...');
		})
		.catch((err) => console.log('Database connection error: ', err.stack));
}

module.exports = databaseConnection;
