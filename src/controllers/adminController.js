const { Admin, User } = require("../models");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

module.exports = {
	getAllAdmin: asyncHandler(async (req, res) => {
		const data = await Admin.findAll();
		return res.sendJson(200, true, "GET_ALL_ADMIN_SUCCESS");
	}),

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
};
