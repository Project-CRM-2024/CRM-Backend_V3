const nodemailer = require('nodemailer');
const { env } = require('process');

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: env.HOST,
			service: env.SERVICE,
			port: Number(env.EMAIL_PORT),
			secure: Boolean(env.SECURE),
			auth: {
				user: env.USER,
				pass: env.PASS
			}
		});

		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: subject,
			text: text
		});
		return true;
	} catch (error) {
		console.log('Error during sending email:', error);
		return false;
	}
};
