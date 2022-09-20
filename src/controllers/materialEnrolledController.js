const {
	Module,
	Quiz,
	Assignment,
	Material,
	Material_Enrolled,
} = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");

module.exports = {
	/**
	 * @desc      update module enrolled
	 * @route     PUT /api/v1/materialenrolled/finish
	 * @access    Private
	 */
	finishMaterial: asyncHandler(async (req, res) => {
		const { student_id, session_id, id_referrer, activity_detail, score } =
			req.body;

		const data = await Material_Enrolled.update(
			{
				activity_detail,
				score,
			},
			{
				where: {
					student_id: student_id,
					session_id: session_id,
					id_referrer: id_referrer,
					status: "FINISHED",
				},
			}
		);

		return res.sendJson(200, true, "Success", data);
	}),

	/**
	 * @desc      get module enrolled
	 * @route     GET /api/v1/materialenrolled/history
	 * @access    Private
	 */
	getMaterialHistory: asyncHandler(async (req, res) => {
		const { student_id, id_referrer } = req.body;

		const data = await Material_Enrolled.findOne({
			where: {
				student_id,
				id_referrer,
			},
		});

		return res.sendJson(200, true, "Success", data);
	}),

	/**
	 * @desc      get module enrolled
	 * @route     GET /api/v1/materialenrolled/bytype/:type
	 * @access    Private
	 */
	getMaterialEnrolled: asyncHandler(async (req, res) => {
		const { type } = req.params;
		const student_id = req.userData.id;

		const data = await Material_Enrolled.findAll({
			where: {
				student_id,
				type,
			},
		});

		return res.sendJson(200, true, "Success", data);
	}),
};
