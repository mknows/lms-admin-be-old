const {
	Material_Enrolled,
	Quiz,
	Material,
	Session
} = require('../models')
const moment = require('moment')
const {Op} = require("sequelize")

module.exports = {
	/**
	 * @desc      Get quiz
	 * @route     GET /api/v1/quiz/desc
	 * @access    Private
	 */
	getQuizDesc: async (req,res) => {
		try {
			const quizzID = req.params.id
			const quizzDesc = await Quiz.findAll({
			where: {
				id: quizzID
			},
			attributes:[
				'session_id','description'
			]
			})
			res.sendJson(200,true,"Success", quizzDesc)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      buat quiz
	 * @route     POST /api/v1/quiz/create
	 * @access    Private
	 */
	makeQuiz: async (req,res) => {
		const {session_id,duration,description,questions,answer} = req.body	
		try {
			const quizzDesc = await Quiz.create({
				session_id:session_id,
				duration:duration,
				description:description,
				questions:questions,
				answer:answer
				})

			await Material.create({
				session_id:session_id,
				duration:duration,
				description:description,
				type: "QUIZ",
				id_referrer: quizzDesc.id,
				})
				
			res.sendJson(200,true,"Success", quizzDesc)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      take quiz
	 * @route     POST /api/v1/quiz/take/:id
	 * @access    Private
	 */
	 takeQuiz: async (req,res) => {
		try {
			const quiz_id = req.params.id
			const user_id = req.userData.id;
			const quizQuestions = await Quiz.findOne({
				where:{
					id: quiz_id
				},
				attributes:[
					'duration','questions','description','session_id'
				]
			})
			const session_id = quizQuestions.dataValues.session_id
			const material = await Material.findOne({
				where: {
					id_referrer: quiz_id
				}
			})
			const session = await Session.findOne({
				where: {
					id: session_id
				}
			})
			const checkIfCurrentlyTaking = await Material_Enrolled.findOne({
				where:{
					student_id:user_id,
					session_id:session_id,
					material_id:material.id,
					subject_id:session.subject_id,
					id_referrer:quiz_id,	
				},
				attributes:[
					'id'
				]
			})
			if(checkIfCurrentlyTaking==null){
				await Material_Enrolled.create({
					student_id:user_id,
					session_id:session_id,
					material_id:material.id,
					subject_id:session.subject_id,
					id_referrer:quiz_id,	
					type:"QUIZ"	
				})	
			}
			res.sendJson(200,true,"Success", quizQuestions)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      submit quiz
	 * @route     POST /api/v1/quiz/submit
	 * @access    Private
	 */
	 postQuizAnswer: async (req,res) => {
		const {answer,quiz_id,duration_taken} = req.body
		const userAnswer = answer
		const user_id = req.userData.id
		const kkm = 70
		let status
		let correct=0
		const quiz = await Quiz.findOne({
			where: {
				id: quiz_id
			},
			attributes:[
				'answer','session_id'
			]
		})

		const quizAns = quiz.answer
		const session_id = quiz.session_id

		const quiz_session = await Session.findOne({
			where: {
				id: session_id
			}
		})

		for(var i = 0, l = quizAns.length ; i<l;i++ ){
			if(userAnswer[i]===quizAns[i]){
				correct++
			}
		}
		const score = (correct / quizAns.length) * 100
		const quizResultDetail = {
			"date_submit":moment().format('MMMM Do YYYY, h:mm:ss a'),
			"number_of_questions": quizAns.length,
			"correct_answers":correct,
			"duration_taken":duration_taken
		}
		if(score>=kkm){
			status = "Passed"
		}
		if(score<kkm){
			status = "Failed"
		}
		if(score>100 || score<0){
			status = "Invalid"
		}
		try {
			const result = await Material_Enrolled.update({
				score:score,
				status:status,
				activity_detail:quizResultDetail
			},{
				where:{
					student_id:user_id,
					subject_id:quiz_session.subject_id,
					id_referrer:quiz_id,
					session_id:session_id
				}
			}
		)	
			res.sendJson(200,true,"Success", null)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
};