const {
	Session,
	StudentSession,
	Subject,
	MaterialEnrolled,
	Student,
} = require("../models");
const { MODULE, QUIZ, ASSIGNMENT, FINISHED } = process.env;
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const { redisClient } = require("../helpers/redis");
const checkExistence = require("../helpers/checkExistence");
const lockUpdate = require("../helpers/lockHelp");

module.exports = {
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/session/create
	 * @access    Public
	 */
	createSession: asyncHandler(async (req, res) => {
		const { subject_id, session_no, duration, is_sync, type, description } =
			req.body;

		const data = await Session.create({
			subject_id: subject_id,
			session_no: session_no,
			duration: duration,
			is_sync: is_sync,
			type: type,
			description: description,
		});
		return res.sendJson(200, true, "success make session", data);
	}),
	/**
	 * @desc      Get All Session
	 * @route     GET /api/v1/session/
	 * @access    Public
	 */
	getAllSessions: asyncHandler(async (req, res) => {
		let result;
		const key = "getAllSessions-" + req.userData.id;
		const cacheResult = await redisClient.get(key);

		if (cacheResult) {
			result = JSON.parse(cacheResult);
		} else {
			const data = await Session.findAll();
			result = data;
			await redisClient.set(key, JSON.stringify(result), {
				EX: 120,
			});
		}

		return res.sendJson(200, true, "success get all sessions", result);
	}),
	/**
	 * @desc      Get All Session in Subject
	 * @route     GET /api/v1/session/getfromsub/:subject_id
	 * @access    Public
	 */
	getAllSessionInSubject: asyncHandler(async (req, res) => {
		const { subject_id } = req.params;
		const student_id = req.student_id;

		if (!(await checkExistence(Subject, subject_id))) {
			return res.status(404).json({
				success: false,
				message: "Invalid Subject ID.",
				data: {},
			});
		}

		const student_subject = await Student.findOne({
			where: {
				id: student_id,
			},
			attributes: ["id"],
			include: {
				model: Subject,
				attributes: ["id"],
				where: {
					id: subject_id,
				},
			},
		});

		if (!student_subject) {
			return res.status(404).json({
				success: false,
				message: "Student is not enrolled in this subject.",
				data: {},
			});
		}

		const data = await Session.findAll({
			where: {
				subject_id: subject_id,
			},
		});

		let sessions = [];
		for (i = 0; i < data.length; i++) {
			data[i].dataValues.is_locked = await lockUpdate(student_id, data[i].id);
		}
		return res.sendJson(200, true, "success get all session in sub", data);
	}),
	/**
	 * @desc      Get Session
	 * @route     GET /api/v1/session/:session_id
	 * @access    Public
	 */
	getSession: asyncHandler(async (req, res) => {
		const { session_id } = req.params;
		const data = await Session.findOne({
			where: {
				id: session_id,
			},
		});
		return res.sendJson(200, true, "success session", data);
	}),
	/**
	 * @desc      update session
	 * @route     put /api/v1/session/edit/:session_id
	 * @access    Private
	 */
	updateSession: asyncHandler(async (req, res) => {
		const { session_id } = req.params;
		let { subject_id, session_no, duration, is_sync, type, description } =
			req.body;

		const exist = await Session.findOne({
			where: {
				id: session_id,
			},
		});

		if (!exist) {
			return res.status(404).json({
				success: false,
				message: "Invalid session id.",
				data: {},
			});
		}

		if (subject_id === null) {
			subject_id = exist.subject_id;
		}
		if (session_no === null) {
			session_no = exist.session_no;
		}
		if (duration === null) {
			duration = exist.duration;
		}
		if (is_sync === null) {
			is_sync = exist.is_sync;
		}
		if (type === null) {
			type = exist.type;
		}
		if (description === null) {
			description = exist.description;
		}

		const sesh = await Session.update(
			{
				subject_id,
				session_no,
				duration,
				is_sync,
				type,
				description,
			},
			{
				where: {
					id: session_id,
				},
				returning: true,
			}
		);
		return res.sendJson(200, true, "Success", { ...sesh[1].dataValues });
	}),
	/**
	 * @desc      Delete session
	 * @route     DELETE /api/v1/sedion/delete/:session_id
	 * @access    Private (Admin)
	 */
	removeSession: asyncHandler(async (req, res, next) => {
		const { session_id } = req.params;

		let data = await Session.findOne({
			where: { id: session_id },
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid session id.",
				data: {},
			});
		}

		Session.destroy({
			where: { id: session_id },
		});

		return res.status(200).json({
			success: true,
			message: `Delete session with ID ${session_id} successfully.`,
			data: {},
		});
	}),

	/**
	 * @desc      Enroll in session
	 * @route     GET /api/v1/session/enroll/:session_id
	 * @access    Public
	 */
	takeSession: asyncHandler(async (req, res) => {
		const { session_id } = req.params;

		const data = await Session.findOne({
			where: {
				id: session_id,
			},
		});

		let studSess = await StudentSession.create({
			session_id,
			student_id: req.student_id,
			present: false,
		});

		return res.sendJson(200, true, "success take session", studSess);
	}),
};
