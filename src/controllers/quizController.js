const { MaterialEnrolled, Quiz, Material, Session } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const moduleTaken = require("../helpers/moduleTaken");
const getSession = require("../helpers/getSession");
const checkExistence = require("../helpers/checkExistence");
const checkDoneSession = require("../helpers/checkDoneSession");
require("dotenv").config({ path: __dirname + "/controllerconfig.env" });
const {
	DRAFT,
	PENDING,
	ONGOING,
	GRADING,
	PASSED,
	FAILED,
	FINISHED,
	ABANDONED,
	INVALID,

	KKM,
	MAX_ATTEMPT,

	QUIZ,
} = process.env;

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
			type: QUIZ,
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
		const student_id = req.student_id;

		let result;

		const quizDesc = await Quiz.findOne({
			where: {
				session_id,
			},
			attributes: ["id", "description"],
		});

		if (!quizDesc) {
			return res.sendJson(404, false, "no quiz found", result);
		}

		let summary = await MaterialEnrolled.findAll({
			where: {
				student_id,
				id_referrer: quizDesc.id,
				[Op.not]: {
					status: ONGOING,
				},
			},
			attributes: [
				"id",
				"activity_detail",
				"score",
				"subject_id",
				"session_id",
				"status",
			],
		});

		const checkIfCurrentlyTaking = await MaterialEnrolled.findOne({
			where: {
				student_id: student_id,
				session_id: session_id,
				id_referrer: quizDesc.id,
				status: ONGOING,
			},
			attributes: ["id"],
		});

		if (checkIfCurrentlyTaking !== null) {
			summary = [];
		}

		result = {
			quiz: quizDesc,
			summary: summary,
		};
		return res.sendJson(200, true, "Success", result);
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
		const student_id = req.student_id;

		const session_id = await getSession(Quiz, quiz_id);

		const max_attempt = parseInt(MAX_ATTEMPT);

		const quizQuestions = await Quiz.findOne({
			where: {
				id: quiz_id,
			},
			attributes: ["duration", "questions", "description", "session_id"],
		});

		// const material = await Material.findOne({
		// 	where: {
		// 		id_referrer: quiz_id,
		// 	},
		// });

		const session = await Session.findOne({
			where: {
				id: session_id,
			},
		});
		const checkIfCurrentlyTaking = await MaterialEnrolled.findOne({
			where: {
				student_id: student_id,
				session_id: session_id,
				// material_id: material.id,
				subject_id: session.subject_id,
				id_referrer: quiz_id,
				status: ONGOING,
			},
			attributes: ["id"],
		});

		const checkHowManyTries = await MaterialEnrolled.findAll({
			where: {
				student_id: student_id,
				session_id: session_id,
				// material_id: material.id,
				subject_id: session.subject_id,
				id_referrer: quiz_id,
				[Op.not]: { status: ONGOING },
			},
			attributes: ["id"],
		});

		let this_material_enrolled;

		if (checkIfCurrentlyTaking != null) {
			// TODO: NOTE THAT THIS IS ERROR BUT RETURNS TRUE TO ACCOMODATE APPS
			return res.sendJson(200, true, "user is currenty having an attempt", {
				quiz: quizQuestions,
				material_enrolled_id: checkIfCurrentlyTaking.id,
			});
		} else if (checkHowManyTries.length >= max_attempt) {
			return res.sendJson(400, false, "user have exceeded maximum attempts", {
				total_attempts: checkHowManyTries.length,
			});
		} else {
			this_material_enrolled = await MaterialEnrolled.create({
				student_id: student_id,
				session_id: session_id,
				// material_id: material.id,
				subject_id: session.subject_id,
				id_referrer: quiz_id,
				status: ONGOING,
				type: QUIZ,
			});
		}
		return res.sendJson(200, true, "Success", {
			quiz: quizQuestions,
			material_enrolled_id: this_material_enrolled.id,
			start_time: this_material_enrolled.created_at,
		});
	}),
	/**
	 * @desc      submit quiz
	 * @route     POST /api/v1/quiz/submit
	 * @access    Private
	 */
	postQuizAnswer: asyncHandler(async (req, res) => {
		const { answer, quiz_id, material_enrolled_id, duration_taken } = req.body;
		const userAnswer = answer;
		const student_id = req.student_id;

		const kkm = parseInt(KKM);
		let status;
		let correct = 0;
		date_submitted = moment().format("MMMM Do YYYY, h:mm:ss a");

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

		let score = (correct / quizAns.length) * 100;
		score = parseFloat(score.toFixed(2));
		const quizResultDetail = {
			date_submit: date_submitted,
			number_of_questions: quizAns.length,
			correct_answers: correct,
			duration_taken: duration_taken,
			answer: answer,
		};

		if (score >= kkm) {
			status = PASSED;
		}
		if (score < kkm) {
			status = FAILED;
		}
		if (score > 100 || score < 0) {
			status = INVALID;
		}

		let material_enrolled_data = await MaterialEnrolled.findOne({
			where: {
				id: material_enrolled_id,
			},
		});

		if (student_id !== material_enrolled_data.student_id) {
			return res.sendJson(
				400,
				false,
				"user who submitted is not the student taking the quiz"
			);
		}

		const result = await MaterialEnrolled.update(
			{
				score: score,
				status: status,
				activity_detail: quizResultDetail,
				status: status,
			},
			{
				where: {
					id: material_enrolled_id,
					id_referrer: quiz_id,
				},
			}
		);

		material_enrolled_data = await MaterialEnrolled.findOne({
			where: {
				id: material_enrolled_id,
			},
		});

		checkDoneSession(student_id, material_enrolled_data.session_id);

		let summary = {
			score: score,
			status: status,
			date_submitted: date_submitted,
			number_of_questions: quizAns.length,
			correct_answers: correct,
			duration_taken: duration_taken,
		};
		return res.sendJson(200, true, "Success", summary);
	}),

	/**
	 * @desc      get Quiz review
	 * @route     POST /api/v1/quiz/review/:id
	 * @access    Private
	 */
	getQuizReview: asyncHandler(async (req, res) => {
		const { material_enrolled_id } = req.params;
		const student_id = req.student_id;

		let user_enroll_data = await MaterialEnrolled.findOne({
			where: {
				student_id,
				id: material_enrolled_id,
			},
			attributes: ["activity_detail", "score", "status", "type", "id_referrer"],
		});

		if (!user_enroll_data) {
			return res.sendJson(404, false, `material enrolled data not found`);
		}

		if (user_enroll_data.type !== QUIZ) {
			return res.sendJson(
				400,
				false,
				`material enrolled id entered is not of a QUIZ but of a ${user_enroll_data.type}`
			);
		}

		if (!user_enroll_data) {
			return res.sendJson(
				404,
				false,
				"user enroll data not found, haven't enrolled / havent submitted"
			);
		}

		const quiz = await Quiz.findOne({
			where: {
				id: user_enroll_data.id_referrer,
			},
			attributes: ["answer", "questions"],
		});

		if (!quiz) {
			return res.sendJson(404, false, "quiz not found");
		}

		let summary = [];

		const user_answer = user_enroll_data.activity_detail.answer;
		const real_answer = quiz.answer;
		const questions = quiz.questions;

		if (
			user_answer.length !== real_answer.length &&
			user_answer.length !== questions.length
		) {
			return res.sendJson(
				400,
				false,
				"answer, user answer, or question length is not equal"
			);
		}

		for (let i = 0; i < user_answer.length; i++) {
			let val = {
				question: questions[i],
				user_answer: user_answer[i],
				real_answer: real_answer[i],
				is_correct: user_answer[i] === real_answer[i],
			};
			summary.push(val);
		}

		let result = {
			summary: summary,
			status: user_enroll_data.status,
		};

		return res.sendJson(200, true, "Success", result);
	}),
};
