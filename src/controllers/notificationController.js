const { User,Notification } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");

module.exports = {
	/**
	 * @desc      create quiz
	 * @route     POST /api/v1/notification/global
	 * @access    Private
	 */
	postNotificationGlobal: asyncHandler(async (req, res) => {
        const {title,notification,type,sender_id} = req.body

		const users = await User.findAll();

        for(let i = 0; i < users.length; i++){
            await Notification.create({
                title,
                notification,
                is_read : FALSE,
                user_id : users[i].id,
                type,
                sender_id
            })
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

        await Notification.update(
            {
                is_read : TRUE
            },
            {
                where:{
                    user_id : user_id,
                    is_read: FALSE
                }
            }
        )

		return res.sendJson(200, true, "Success", "Notification read");
	}),
};
