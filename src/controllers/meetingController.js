const { Meeting } = require("../models");
const asyncHandler = require("express-async-handler");
("use strict");

module.exports = {
	/**
	 * @desc      create new meeting student and assessor
	 * @route     POST /api/v1/meeting/create
	 * @access    Private
	 */
	createMeeting: asyncHandler(async (req, res) => {
		const { meeting_type, time, place, topic, descrption } = req.body;
		const user = req.userData;

		const data = await Meeting.create({
			user_id: user.id,
			meeting_type,
			time,
			place,
			topic,
			descrption,
		});
	}),
};
