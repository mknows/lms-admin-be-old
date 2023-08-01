const { Admin, User } = require("../models");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

module.exports = {
	getAllAdmin: async (req, res) => {
		try {
			const data = await Admins.findAll();

			return res.sendJson(200, true, "sucess get all data admin", data);
		} catch (error) {
			return res.sendJson(500, false, error, {});
		}
	},

	createAdmin: asyncHandler(async (req, res) => {
		let { user_id } = req.body;

		let user = await User.findOne({
			where: {
				id: user_id,
			},
		});

		if (!user) {
			return res.sendJson(400, false, "Invalid user Id", {});
		}

		let admin = await Admin.findOne({
			where: {
				id: user_id,
			},
		});

		if (admin) {
			return res.sendJson(
				400,
				false,
				`user with id ${user_id} is already an admin`,
				admin
			);
		}

		const created = await Admin.create({
			id: user_id,
			name: user.full_name,
		});

		return res.sendJson(200, true, "sucess create data admin", created);
	}),

	/**
	 * @desc      Login Account Using Email and Password
	 * @route     POST /api/v1/auth/login
	 * @access    Public
	 */
	loginAdmin: asyncHandler(async (req, res) => {
		const { email, password } = req.body;

		const auth = getClientAuth();
		const credential = await signInWithEmailAndPassword(auth, email, password);

		// NOTE: check email verified in firebase
		// if (credential.user.emailVerified == false) {
		// 	return res.sendJson(
		// 		401,
		// 		false,
		// 		"sorry, please verify your email address"
		// 	);
		// }

		const dataPostgre = await Admin.findOne({
			where: { email },
		});

		if (!dataPostgre) {
			return res.sendJson(
				401,
				false,
				"sorry, your account is not in the database"
			);
		}

		await insertLogActivity(
			req,
			dataPostgre.dataValues.id,
			"Login with Email and Password"
		);

		const token = await auth.currentUser.getIdToken();

		return res.sendJson(
			200,
			true,
			`Login success as ADMIN ${credential.user.displayName}!`,
			{ token },
			{
				name: "token",
				value: token,
			}
		);
	}),
};
