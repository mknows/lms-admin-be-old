const { Material_Enrolled, Quiz, Material, Session } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");

module.exports = {
	/**
	 * @desc      create quiz
	 * @route     POST /api/v1/quiz/create
	 * @access    Private
	 */
	createQuiz: asyncHandler(async (req, res) => {
		const { session_id, duration, description, questions, answer } = req.body;

		const quizzDesc = await Quiz.create({
			session_id: session_id,
			duration: duration,
			description: description,
			questions: questions,
			answer: answer,
		});

		await Material.create({
			session_id: session_id,
			duration: duration,
			description: description,
			type: "QUIZ",
			id_referrer: quizzDesc.id,
		});

		return res.sendJson(200, true, "Success", quizzDesc);
	}),
	/**
	 * @desc      Get quiz
	 * @route     GET /api/v1/quiz/desc/:quiz_id
	 * @access    Private
	 */
	getQuizDesc: asyncHandler(async (req, res) => {
		const { quiz_id } = req.params;
		const quizzDesc = await Quiz.findAll({
			where: {
				id: quiz_id,
			},
			attributes: ["session_id", "description"],
		});
		return res.sendJson(200, true, "Success", quizzDesc);
	}),
	/**
	 * @desc      Get quiz
	 * @route     GET /api/v1/quiz/desc/session/:session_id
	 * @access    Private
	 */
	getQuizDescBySession: asyncHandler(async (req, res) => {
		const { session_id } = req.params;
		const quizzDesc = await Quiz.findAll({
			where: {
				session_id,
			},
			attributes: ["id", "description"],
		});
		return res.sendJson(200, true, "Success", quizzDesc);
	}),
	/**
	 * @desc      update quiz
	 * @route     PUT /api/v1/quiz/:quiz_id
	 * @access    Private
	 */
	updateQuiz: asyncHandler(async (req, res) => {
		const { quiz_id } = req.params;
		let { session_id, duration, description, questions, answer } = req.body;

		const exist = await Quiz.findOne({
			where: {
				quiz_id,
			},
		});

		if (!exist) {
			return res.status(404).json({
				success: false,
				message: "Invalid quiz id.",
				data: {},
			});
		}

		if (session_id === null) {
			session_id = exist.session_id;
		}
		if (duration === null) {
			duration = exist.duration;
		}
		if (description === null) {
			description = exist.description;
		}
		if (questions === null) {
			questions = exist.questions;
		}
		if (answer === null) {
			answer = exist.answer;
		}

		const quiz = await Quiz.update(
			{
				session_id,
				duration,
				description,
				questions,
				answer,
			},
			{
				where: {
					id: quiz_id,
				},
				returning: true,
			}
		);
		return res.sendJson(200, true, "Success", { ...quiz[1].dataValues });
	}),

	/**
	 * @desc      Delete quiz
	 * @route     DELETE /api/v1/quiz/delete/:quiz_id
	 * @access    Private (Admin)
	 */
	removeQuiz: asyncHandler(async (req, res, next) => {
		const { quiz_id } = req.params;

		const exist = await Quiz.findOne({
			where: { id: quiz_id },
		});

		if (!exist) {
			return res.status(404).json({
				success: false,
				message: "Invalid quiz id.",
				data: {},
			});
		}

		Quiz.destroy({
			where: { id: quiz_id },
		});

		return res.status(200).json({
			success: true,
			message: `Delete quiz with ID ${quiz_id} successfully.`,
			data: {},
		});
	}),
	/**
	 * @desc      take quiz
	 * @route     POST /api/v1/quiz/take/:id
	 * @access    Private
	 */
	takeQuiz: asyncHandler(async (req, res) => {
		const { quiz_id } = req.params;
		const user_id = req.userData.id;
		const quizQuestions = await Quiz.findOne({
			where: {
				id: quiz_id,
			},
			attributes: ["duration", "questions", "description", "session_id"],
		});
		const session_id = quizQuestions.dataValues.session_id;
		const material = await Material.findOne({
			where: {
				id_referrer: quiz_id,
			},
		});
		const session = await Session.findOne({
			where: {
				id: session_id,
			},
		});
		const checkIfCurrentlyTaking = await Material_Enrolled.findOne({
			where: {
				student_id: user_id,
				session_id: session_id,
				material_id: material.id,
				subject_id: session.subject_id,
				id_referrer: quiz_id,
			},
			attributes: ["id"],
		});
		if (checkIfCurrentlyTaking == null) {
			await Material_Enrolled.create({
				student_id: user_id,
				session_id: session_id,
				material_id: material.id,
				subject_id: session.subject_id,
				id_referrer: quiz_id,
				type: "QUIZ",
			});
		}
		return res.sendJson(200, true, "Success", quizQuestions);
	}),
	/**
	 * @desc      submit quiz
	 * @route     POST /api/v1/quiz/submit
	 * @access    Private
	 */
	postQuizAnswer: asyncHandler(async (req, res) => {
		const { answer, quiz_id, duration_taken } = req.body;
		const userAnswer = answer;
		const user_id = req.userData.id;
		const kkm = 70;
		let status;
		let correct = 0;
		const quiz = await Quiz.findOne({
			where: {
				id: quiz_id,
			},
			attributes: ["answer", "session_id"],
		});

		const quizAns = quiz.answer;
		const session_id = quiz.session_id;

		const quiz_session = await Session.findOne({
			where: {
				id: session_id,
			},
		});

		for (var i = 0, l = quizAns.length; i < l; i++) {
			if (userAnswer[i] === quizAns[i]) {
				correct++;
			}
		}
		const score = (correct / quizAns.length) * 100;
		const quizResultDetail = {
			date_submit: moment().format("MMMM Do YYYY, h:mm:ss a"),
			number_of_questions: quizAns.length,
			correct_answers: correct,
			duration_taken: duration_taken,
		};
		if (score >= kkm) {
			status = "Passed";
		}
		if (score < kkm) {
			status = "Failed";
		}
		if (score > 100 || score < 0) {
			status = "Invalid";
		}

		const result = await Material_Enrolled.update(
			{
				score: score,
				status: status,
				activity_detail: quizResultDetail,
			},
			{
				where: {
					student_id: user_id,
					subject_id: quiz_session.subject_id,
					id_referrer: quiz_id,
					session_id: session_id,
				},
			}
		);
		return res.sendJson(200, true, "Success", null);
	}),
};
