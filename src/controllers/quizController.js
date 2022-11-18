const {
	MaterialEnrolled,
	Quiz,
	Material,
	Session,
	Student,
	StudentSubject,
	StudentSession,
} = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const moduleTaken = require("../helpers/moduleTaken");
const getSession = require("../helpers/getSession");
const checkExistence = require("../helpers/checkExistence");
const checkDoneSession = require("../helpers/checkDoneSession");
const certificateController = require("./certificateController");

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
	 * @desc      continue quiz
	 * @route     GET /api/v1/quiz/continue/:material_enrolled_id
	 * @access    Private
	 */
	continueQuiz: asyncHandler(async (req, res) => {
		const { material_enrolled_id } = req.params;
		let mat_enr = await MaterialEnrolled.findOne({
			where: {
				id: material_enrolled_id,
				type: QUIZ,
			},
		});

		if (!mat_enr) {
			return res.sendJson(404, false, "no material enrolled found", {});
		}

		let quiz = await Quiz.findOne({
			where: {
				id: mat_enr.id_referrer,
			},
			attributes: ["duration", "questions", "description", "session_id"],
		});

		return res.sendJson(200, true, "Success", {
			quiz: quiz,
			quiz_id: mat_enr.id_referrer,
			material_enrolled_id: material_enrolled_id,
		});
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
		let max_attempt = parseInt(MAX_ATTEMPT);

		const quiz = await Quiz.findOne({
			where: {
				id: quiz_id,
			},
			include: {
				model: Session,
				include: {
					model: Student,
					through: {
						attributes: {
							include: ["created_at"],
						},
						where: {
							student_id,
						},
					},
				},
			},
		});

		if (quiz.Session.Students[0]) {
			if (quiz.Session.session_no === 0) {
				max_attempt = 1;
				const date_pretest = moment(
					quiz.Session.Students[0].StudentSession.created_at,
					"DD-MM-YYYY"
				).add(3, "days");
				if (!moment().isSame(date_pretest, "date")) {
					return res.sendJson(
						400,
						false,
						`Student isn't eligible to take the pretest now. Available at ${date_pretest}`,
						{}
					);
				}
			}
		} else {
			return res.sendJson(
				400,
				false,
				"Student is not enrolled to this session",
				{}
			);
		}
		// const material = await Material.findOne({
		// 	where: {
		// 		id_referrer: quiz_id,
		// 	},
		// });

		const checkIfCurrentlyTaking = await MaterialEnrolled.findOne({
			where: {
				student_id: student_id,
				session_id: quiz.Session.id,
				// material_id: material.id,
				subject_id: quiz.Session.subject_id,
				id_referrer: quiz_id,
				status: ONGOING,
			},
			attributes: ["id", "created_at"],
		});

		const checkHowManyTries = await MaterialEnrolled.findAll({
			where: {
				student_id: student_id,
				session_id: quiz.Session.id,
				// material_id: material.id,
				subject_id: quiz.Session.subject_id,
				id_referrer: quiz_id,
				[Op.not]: { status: ONGOING },
			},
			attributes: ["id", "created_at"],
		});

		let this_material_enrolled;

		let deadline = moment(
			new Date(
				new Date(checkIfCurrentlyTaking.created_at).getTime() +
					quiz?.duration * 1000
			)
		);

		if (checkIfCurrentlyTaking != null) {
			// TODO: NOTE THAT THIS IS ERROR BUT RETURNS TRUE TO ACCOMODATE APPS
			return res.sendJson(200, true, "user is currenty having an attempt", {
				quiz: quiz.questions,
				material_enrolled_id: checkIfCurrentlyTaking.id,
				start_time: checkIfCurrentlyTaking.created_at,
				deadline: deadline,
			});
		} else if (checkHowManyTries.length >= max_attempt) {
			return res.sendJson(400, false, "user have exceeded maximum attempts", {
				total_attempts: checkHowManyTries.length,
			});
		} else {
			this_material_enrolled = await MaterialEnrolled.create({
				student_id: student_id,
				session_id: quiz.Session.id,
				// material_id: material.id,
				subject_id: quiz.Session.subject_id,
				id_referrer: quiz_id,
				status: ONGOING,
				type: QUIZ,
			});
		}

		deadline = moment(
			new Date(
				new Date(this_material_enrolled.created_at).getTime() +
					quiz?.duration * 1000
			)
		);

		console.log(deadline);

		return res.sendJson(200, true, "Success", {
			quiz: quiz.questions,
			material_enrolled_id: this_material_enrolled.id,
			start_time: this_material_enrolled.created_at,
			deadline: deadline,
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
		date_submitted = moment().format("DD/MM/YYYY hh:mm:ss");

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

		let summary = {
			score: score,
			status: status,
			date_submitted: date_submitted,
			number_of_questions: quizAns.length,
			correct_answers: correct,
			duration_taken: duration_taken,
		};
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

		if (quiz_session.session_no === 0) {
			if (score >= kkm) {
				let data = {
					student_id,
					subject_id: quiz_session.subject_id,
					final_subject_score: score,
				};
				await MaterialEnrolled.update(
					{
						status: FINISHED,
						score,
					},
					{
						where: {
							student_id,
							subject_id: quiz_session.subject_id,
							session_id,
							activity_detail: summary,
						},
					}
				);
				await StudentSession.update(
					{
						date_present: date_submitted,
						final_score: score,
						present: true,
					},
					{
						where: {
							student_id,
							session_id,
						},
					}
				);
				await StudentSubject.update(
					{
						status: FINISHED,
						date_finished: moment().tz("Asia/Jakarta"),
					},
					{
						where: {
							student_id,
							subject_id: quiz_session.subject_id,
						},
					}
				);
				await certificateController.createCertificateSubject(data);
				return res.sendJson(
					200,
					true,
					"Student Passed. Check your profile to get your certificate.",
					summary
				);
			}
			if (score < kkm) {
				await MaterialEnrolled.update(
					{
						status: FAILED,
						score,
					},
					{
						where: {
							student_id,
							subject_id: quiz_session.subject_id,
							session_id,
						},
					}
				);
				await StudentSession.update(
					{
						date_present: date_submitted,
						final_score: score,
						present: true,
					},
					{
						where: {
							student_id,
							session_id,
						},
					}
				);
				await StudentSubject.update(
					{
						status: FAILED,
						date_finished: moment().tz("Asia/Jakarta"),
						final_score: score,
					},
					{
						where: {
							student_id,
							subject_id: quiz_session.subject_id,
						},
					}
				);
				return res.sendJson(200, true, "Student Failed", summary);
			}
		}

		material_enrolled_data = await MaterialEnrolled.findOne({
			where: {
				id: material_enrolled_id,
			},
		});

		checkDoneSession(student_id, material_enrolled_data.session_id);

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

	/**
	 * @desc      Get current quiz
	 * @route     GET /api/v1/quiz/current/
	 * @access    Private (Admin)
	 */
	getCurrentQuiz: asyncHandler(async (req, res, next) => {
		const student_id = req.student_id;

		let mat_enr_get = await MaterialEnrolled.findAll({
			where: {
				student_id,
				type: QUIZ,
				status: ONGOING,
			},
			attributes: {
				include: ["created_at"],
			},
		});

		if (mat_enr_get.length === 0) {
			return res.sendJson(
				200,
				true,
				"User is not currently taking any quizzes",
				{}
			);
		}

		let result = [];

		for (let i = 0; i < mat_enr_get.length; i++) {
			let quiz = await Quiz.findOne({
				where: { id: mat_enr_get[i].id_referrer },
				attributes: ["duration", "questions", "description", "session_id"],
			});

			let deadline = moment(
				new Date(
					new Date(mat_enr_get[i].created_at).getTime() + quiz?.duration * 1000
				)
			);

			let datval = {
				quiz_id: mat_enr_get[i].id_referrer,
				material_enrolled_id: mat_enr_get[i].id,
				original_start_time: mat_enr_get[i].created_at,
				deadline: deadline,
			};

			result.push(datval);
		}

		return res.sendJson(
			200,
			true,
			"User is currently taking these quizzes",
			result
		);
	}),
	/**
	 * @desc      Get current quiz
	 * @route     GET /api/v1/quiz/pretest/
	 * @access    Private
	 */
	getPretestDate: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const student_pretest = await Student.findOne({
			attributes: {
				include: ["id"],
			},
			where: {
				id: student_id,
			},
			include: {
				model: Session,
				attributes: {
					include: ["id"],
				},
				where: {
					session_no: 0,
				},
				through: {
					attributes: {
						include: ["created_at"],
					},
				},
			},
		});
		if (!student_pretest) {
			return res.sendJson(
				400,
				false,
				"Student isn't enrolled for any pretests",
				{}
			);
		} else {
			let result = [];
			for (let i = 0; i < student_pretest.Sessions.length; i++) {
				const date_pretest = moment(
					student_pretest.Sessions[i].StudentSession.created_at,
					"DD-MM-YYYY"
				).add(3, "days");
				const date_pretest_over = moment(
					student_pretest.Sessions[i].StudentSession.created_at,
					"DD-MM-YYYY"
				).add(4, "days");
				result.push({
					session_id: student_pretest.Sessions[i].id,
					date_pretest: date_pretest.format("DD/MM/YYYY"),
					status: !moment().isAfter(date_pretest_over, "date")
						? "SCHEDULED"
						: "LATE",
					eligible: moment().isSame(date_pretest, "date") ? true : false,
				});
			}
			return res.sendJson(200, true, "Success", result);
		}
	}),
};
