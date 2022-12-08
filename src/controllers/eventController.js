const { Event, StudentEvent } = require("../models");
const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const pagination = require("../helpers/pagination");
const moment = require("moment/moment");

module.exports = {
	/**
	 * @desc      Get all events
	 * @route     POST /api/v1/events/all?page=(number)&limit=(number)
	 * @access    Private
	 **/
	getAllSchedule: asyncHandler(async (req, res) => {
		const { page, limit } = req.query;

		let events = await Event.findAll({
			where: {
				registration_closed: {
					[Op.gte]: moment().toDate(),
				},
			},
		});
		events = await pagination(events, page, limit);
		return res.sendJson(200, true, "Success", events);
	}),
	/**
	 * @desc      Participate the event
	 * @route     POST /api/v1/events/join/:event_id
	 * @access    Private
	 **/
	joinEvent: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const { event_id } = req.params;
		const student_event = await StudentEvent.findOne({
			where: {
				student_id,
				event_id,
			},
		});
		if (student_event) {
			return res.sendJson(
				400,
				false,
				"Student has already participated in this event"
			);
		}
		const event = await StudentEvent.create({
			student_id,
			event_id,
			status: "ONGOING",
		});

		delete event.dataValues["deleted_at"];
		delete event.dataValues["created_at"];
		delete event.dataValues["updated_at"];
		delete event.dataValues["created_by"];
		delete event.dataValues["updated_by"];

		return res.sendJson(200, true, "Success", event);
	}),
};
