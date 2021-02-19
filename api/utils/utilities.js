const appRoot = require('app-root-path');
const mjml2html = require('mjml');
const nodemailer = require('nodemailer');
const fs = require('fs');

module.exports = {
	transporter: nodemailer.createTransport({
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
	}),
	deleteOldFiles: async (idUri, wcardUri, codcUri) => {
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
	},
	getEmailHtml: (subject, code) => {
		const link = `${process.env.BASE_URL}/verification/${code}`;
		let message = `
		<mjml>
			<mj-head>
				<mj-font name="Roboto"
       href="https://fonts.googleapis.com/css2?family=Roboto" />
			</mj-head>
			<mj-body>
				<mj-section>
					<mj-column>
						<mj-text font-size="25px" align="center" color="#1976d2" font-weight="bold" font-family="Roboto, sans-serif, Arial">Express Money, Service Client</mj-text>
						<mj-divider border-color="#1976d2"></mj-divider>`;
		if (subject.includes('Cliquez'))
			message += `<mj-button font-family="Roboto, sans-serif, Arial" font-size="20px" background-color="#1976d2" color="white" href=${link}>
						Cliquez ici pour vérifier votre adresse email
					</mj-button>`;
		else {
			message += `<mj-text font-family="Roboto, sans-serif, Arial" font-size="20px" align="center" padding-top="20px">${subject}</mj-text>`;
			message += `<mj-text font-family="Roboto, sans-serif, Arial" margin-top="15px" font-weight="bold" font-size="40px" align="center" padding-top="35px">${code}</mj-text>`;
		}

		message += `</mj-column>
				</mj-section>
			</mj-body>
		</mjml>`;
		return mjml2html(message).html;
	}
};
