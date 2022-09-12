require("dotenv").config({ path: "../config/.env" });
const nodemailer = require("nodemailer");

const { SERVER_MAIL_ADDRESS, SERVER_MAIL_PASS } = process.env;

module.exports = {
	sendEmail: async (to, subject, html) => {
		try {
			const transporter = nodemailer.createTransport({
				service: "gmail",
				// host: "smtp.ethereal.email",
				// port: 587,
				auth: {
					user: SERVER_MAIL_ADDRESS,
					pass: SERVER_MAIL_PASS,
				},
			});

			const mailOptions = {
				to,
				subject,
				html,
			};

			const response = await transporter.sendMail(mailOptions);

			return response;
		} catch (err) {
			console.log("error : ", err);
			return err;
		}
	},
};
