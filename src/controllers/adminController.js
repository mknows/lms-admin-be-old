const { Admins } = require("../models");
const bcrypt = require("bcryptjs");

module.exports = {
	getAllAdmin: async (req, res) => {
		try {
			const data = await Admins.findAll();

			return res.sendJson(200, true, "sucess get all data admin", data);
		} catch (error) {
			return res.sendJson(500, false, error, {});
		}
	},

	createAdmin: async (req, res) => {
		try {
			const { fullName, email, password, gender, phone } = req.body;

			const hashPassword = bcrypt.hashSync(password, 10);

			const created = await Admins.create({
				fullName,
				email,
				password: hashPassword,
				gender,
				phone,
				isLecturer: false,
				isVerified: false,
			});

			return res.sendJson(200, true, "sucess create data admin", created);
		} catch (error) {
			return res.sendJson(403, false, error, {});
		}
	},
};
