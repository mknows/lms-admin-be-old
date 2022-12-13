const { Meeting, User } = require("../models");
const asyncHandler = require("express-async-handler");

module.exports = {
	/**
	 * @desc      create new meeting student and assessor
	 * @route     POST /api/v1/meeting/create
	 * @access    Private
	 */
	createMeeting: asyncHandler(async (req, res) => {
		const { meeting_type, time, place, topic, description } = req.body;
		const user = req.userData;

		const data = await Meeting.create({
			user_id: user.id,
			meeting_type,
			time,
			place,
			topic,
			description,
			status: false,
		});

		return res.sendJson(201, "success create data", data);
	}),

	/**
	 * @desc      get all meeting by student
	 * @route     GET /api/v1/meeting/
	 * @access    Private
	 */
	getAllMeetingByStudent: asyncHandler(async (req, res) => {
		const user = req.userData;

		const data = await Meeting.findAll({
			where: {
				user_id: user.id,
			},
		});

		return res.sendJson(
			200,
			true,
			`success get data by student ${user.full_name}`,
			data
		);
	}),

	/**
	 * @desc      show data by id
	 * @route     GET /api/v1/meeting/:id
	 * @access    Private
	 */
	showDataById: asyncHandler(async (req, res) => {
		const { id } = req.params;
		const user = req.userData;

		const data = await Meeting.findOne({
			where: {
				id,
			},
		});

		if (!data) {
			return res.sendJson(404, false, "data meeting not found");
		}

		return res.sendJson(200, true, "success get data by id", data);
	}),

	/**
	 * @desc      acc meeting by assessor for stuent, must login by lecturer
	 * @route     PUT /api/v1/meeting/assessor/:id
	 * @access    Private
	 */
	accMeetingByAssessor: asyncHandler(async (req, res) => {
		const { id } = req.params;
		const { status } = req.body;
		const user = req.userData;

		const checkData = await Meeting.findOne({
			where: {
				id,
			},
		});

		const student = await User.findOne({
			where: {
				id: checkData.user_id,
			},
		});

		if (!checkData) {
			return res.sendJson(404, false, "data meeting not found");
		}

		const data = await Meeting.update(
			{
				status,
			},
			{
				where: {
					id,
				},
			}
		);

		return res.sendJson(
			200,
			true,
			`success update meeting by assessor ${user.full_name} with student ${student.full_name}`,
			{ result: data == 1 ? "acc | TRUE" : "reject | FALSE" }
		);
	}),
};
