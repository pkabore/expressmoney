const authenticator = require('otplib').authenticator;
const secret = authenticator.generateSecret();
const token = authenticator.generate(secret);

const mjml2html = require('mjml');

const getEmailHtml = (subject, code) => {
	const link = `${process.env.BASE_URL}/verification/${code}`;
	let message = `
		<mjml>
			<mj-head>
				<mj-font name="Baloo 2"
				href="https://fonts.googleapis.com/css?family=Baloo+2" />
			</mj-head>
			<mj-body>
				<mj-section>
					<mj-column>
						<mj-text font-size="30px" align="center" font-weight='' font-family="'Baloo 2'">Express Money, Service Client</mj-text>
							<mj-divider border-color="#1976d2"></mj-divider>`;

	if (subject.includes('Cliquez'))
		message += `<mj-button font-family="Baloo 2" font-size=20 background-color="#1976d2" color="white" href=${link}>
								Cliquez ici pour vérifier votre compte
							</mj-button>`;
	else
		message += `<mj-text font-family="'Baloo 2'" font-size="25px" font-weight="bold" align="center" padding-top="35px">${subject}: ${code}</mj-text>`;

	message += `</mj-column>
				</mj-section>
			</mj-body>
		</mjml>`;
	return mjml2html(message).html;
};

console.log(getEmailHtml('Cliquez', 451237));
