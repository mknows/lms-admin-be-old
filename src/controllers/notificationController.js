const { User, Notification } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");

module.exports = {
	/**
	 * @desc      get all notification
	 * @route     POST /api/v1/notification/get
	 * @access    Private
	 */
	getNotification: asyncHandler(async (req, res) => {
		const user_id = req.userData.id;
		console.log(user_id);
		let notification = await Notification.findAll({
			attributes: {
				include: ["created_at"],
			},
			where: {
				user_id,
			},
			order: [["created_at", "DESC"]],
		});

		return res.sendJson(200, true, "Success", notification);
	}),
	/**
	 * @desc      create quiz
	 * @route     POST /api/v1/notification/post
	 * @access    Private
	 */
	postNotificationGlobal: asyncHandler(async (req, res) => {
		const { title, notification, type, sender_id } = req.body;

		const users = await User.findAll();

		for (let i = 0; i < users.length; i++) {
			await Notification.create({
				title,
				notification,
				is_read: false,
				user_id: users[i].id,
				type,
				sender_id,
			});
		}

		return res.sendJson(200, true, "Success", "Sent the notifications");
	}),
	/**
	 * @desc      create quiz
	 * @route     PUT /api/v1/notification/read
	 * @access    Private
	 */
	readNotification: asyncHandler(async (req, res) => {
		const user_id = req.userData.id;

		let notification = await Notification.update(
			{
				is_read: true,
			},
			{
				where: {
					user_id: user_id,
					is_read: false,
				},
				returning: true,
			}
		);
		notification = notification[1][0];

		return res.sendJson(200, true, "Success", notification);
	}),
};
