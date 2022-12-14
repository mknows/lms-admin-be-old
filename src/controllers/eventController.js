const {
	Event,
	StudentEvent,
	Student,
	Session,
	DiscussionForum,
	Reply,
	Comment,
} = require("../models");
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
	getAllEvents: asyncHandler(async (req, res) => {
		const { page, limit } = req.query;

		let events = await Event.findAll({
			attributes: ["date_start", "name", "thumbnail", "price", "id"],
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
	 * @desc      Get all events
	 * @route     POST /api/v1/events/event/:id
	 * @access    Private
	 **/
	getEvent: asyncHandler(async (req, res) => {
		const { id } = req.params;

		let event = await Event.findOne({
			where: {
				id,
				registration_closed: {
					[Op.gte]: moment().toDate(),
				},
			},
		});
		return res.sendJson(200, true, "Success", event);
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
	/**
	 * @desc      Participate the event
	 * @route     GET /api/v1/events/student
	 * @access    Private
	 **/
	getStudentsEvent: asyncHandler(async (req, res) => {
		const student_id = req.student_id;

		const student_event = await Promise.all([
			await Student.findAll({
				where: {
					id: student_id,
				},
				include: {
					model: Event,
					through: {
						where: {
							status: "ONGOING",
						},
					},
				},
			}),
			await Student.findAll({
				where: {
					id: student_id,
				},
				include: {
					model: Event,
					through: {
						where: {
							status: "FINISHED",
						},
					},
				},
			}),
		]);
		let result = {
			ongoing: student_event[0],
			finished: student_event[1],
		};
		return res.sendJson(200, true, "Success", result);
	}),
};
