const { Admin, User } = require("../models");
const asyncHandler = require("express-async-handler");
const admin = require("firebase-admin");

module.exports = {
	/**
	 * @desc      delete all user firebase
	 * @route     DELETE /api/v1/admin/nukeusers
	 * @access    Admin
	 */
	deleteAllUser: asyncHandler(async (req, res) => {
		const { users } = await admin.auth().listUsers(1000);

		users.map(async (user) => {
			// KODE HARAM
			await admin.auth().deleteUser(user.uid);
		});

		return res.sendJson(200, true, "SUCCESS_DELETE_ALL_USER_FIREBASE", users);
	}),

	getAllAdmin: asyncHandler(async (req, res) => {
		const data = await Admin.findAll({
			include: {
				model: User,
			},
		});
		return res.sendJson(200, true, "GET_ALL_ADMIN_SUCCESS", data);
	}),

	createAdmin: asyncHandler(async (req, res) => {
		let { user_id } = req.body;

		let user = await User.findOne({
			where: {
				id: user_id,
			},
		});

		if (!user) {
			return res.sendJson(400, false, "INVALID_USER_ID", {});
		}

		let admin = await Admin.findOne({
			where: {
				user_id: user_id,
			},
		});

		if (admin) {
			return res.sendJson(400, false, "USER_ALREADY_ADMIN", admin);
		}

		const created = await Admin.create({
			user_id: user_id,
			name: user.full_name,
		});

		return res.sendJson(200, true, "SUCCESS_CREATE_ADMIN", created);
	}),

	/**
	 * @desc      search users
	 * @route     POST /api/v1/admin/user
	 * @access    Public
	 */
	searchUser: asyncHandler(async (req, res) => {
		const { user_query } = req.body;

		let whereClause = {};
		if (user_query !== undefined) {
			whereClause = {
				email: {
					[Op.like]: `%${user_query}%`,
				},
			};
		}
		const users = await User.findAll({
			where: whereClause,
		});
		return res.sendJson(200, true, "USER_SEARCH_SUCCESS", users);
	}),

	/**
	 * @desc      Get User Login Data (Profile)
	 * @route     GET /api/v1/admin/me
	 * @access    Private
	 */
	getAdminProfile: asyncHandler(async (req, res) => {
		let user = req.userData;

		const data = await User.findOne({
			where: {
				firebase_uid: user.firebase_uid,
			},
			attributes: {
				exclude: ["id", "firebase_uid", "password", "deleted_at", "updated_at"],
			},
		});

		return res.status(200).json({
			success: true,
			message: "Account connected.",
			data: { ...data.dataValues, role: req.role },
		});
	}),
};
