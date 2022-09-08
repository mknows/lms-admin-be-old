const {Student, 
	Subject, 
	Material_Enrolled,
	Module,
	Video,
	Document,
	Quiz,
	StudentSubject,
	Major,
	Session, 
	Material
} = require('../models')
const moment = require('moment')
const {Op} = require("sequelize")

module.exports = {
	/**
	 * @desc      Get All subject
	 * @route     GET /api/v1/studiku/allSubject
	 * @access    Public
	 */
	getAllSubject: async (req, res) => {
		try {
			const data = await Subject.findAll();
			res.sendJson(
				200, 
				true, 
				"sucess get all data", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      Get Module
	 * @route     GET /api/v1/studiku/getModule/:id
	 * @access    Private
	 */
	getModule: async (req,res) => {
		try {
			const moduleID = req.params.id
			const moduleData = await Module.findAll({
			where: {
				id: moduleID
			},
			include: [
				{
					model:Document
				},
				{
					model:Video
				}
			]
		})
			res.sendJson(200,true,"Success", moduleData)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      Get All Session in Subject
	 * @route     GET /api/v1/studiku/session/:sub_id
	 * @access    Public
	 */
	 getAllSessionInSubject: async (req, res) => {
		try {
			const sub_id =  req.params.sub_id
			const data = await Session.findAll({
				where : {
					subject_id: sub_id
				}
			});
			res.sendJson(
				200, 
				true, 
				"sucess get all data", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      Get quiz
	 * @route     GET /api/v1/studiku/getQuizDesc
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
	 * @route     POST /api/v1/studiku/makeQuiz
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
	 * @route     POST /api/v1/studiku/takeQuiz/:id
	 * @access    Private
	 */
	 takeQuiz: async (req,res) => {
		try {
			const quiz_id = req.params.id
			const {material_id,subject_id} = req.body
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
			const checkIfCurrentlyTaking = await Material_Enrolled.findOne({
				where:{
					student_id:user_id,
					session_id:session_id,
					material_id:material_id,
					subject_id:subject_id,
					id_referrer:quiz_id,	
				},
				attributes:[
					'id'
				]
			})
			if(checkIfCurrentlyTaking==null){
				const studentTakingQuiz = await Material_Enrolled.create({
					student_id:user_id,
					session_id:session_id,
					material_id:material_id,
					subject_id:subject_id,
					id_referrer:quiz_id,	
					type:"quiz"	
				})	
			}
			res.sendJson(200,true,"Success", quizQuestions)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      submit quiz
	 * @route     POST /api/v1/studiku/postQuizAnswer
	 * @access    Private
	 */
	 postQuizAnswer: async (req,res) => {
		const {answer,quiz_id,subject_id,duration_taken} = req.body
		const userAnswer = answer
		const user_id = req.userData.id
		const kkm = 70
		let status
		let correct=0
		const quiz = await Quiz.findAll({
			where: {
				id: quiz_id
			},
			attributes:[
				'answer','session_id'
			]
		})
		const quizAns = quiz[0].dataValues.answer
		const session_id = quiz[0].dataValues.session_id
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
					subject_id:subject_id,
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
	/**
	 * @desc      Get subjects of student
	 * @route     GET /api/v1/studiku/getSubject
	 * @access    Private
	 */
	getSubjectForStudent: async (req,res) => {
		const user_id = req.userData.id
		try {
			const subjectTaken = await Student.findAll({
				where:{
					id:user_id
				},
				include: [Major,Subject]
			})
			const subjectTakenID = await getID(subjectTaken)
			
			const majorSubject = await Major.findAll({
				include: Subject
			})
			const majorSubjectID = await getID(majorSubject)
			
			const result = recommendation(subjectTakenID,majorSubjectID)

			res.sendJson(200,true,"Success", result )
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      enroll in a subject
	 * @route     POST /api/v1/studiku/takeSubject
	 * @access    Private
	 */
	 takeSubject: async (req,res) => {
		const {subject_id,student_id} = req.body
		const credit_thresh = 24;
		try {
			const checkIfSubjectTaken = await StudentSubject.findOne({
				where: {
					subject_id:subject_id,
					student_id:student_id
				},
				attributes:[
					"id"
				],
				include: Subject
			})
			const checkCredit = await StudentSubject.findAll({
				where: {
					student_id:student_id,
					[Op.or]:[
						{status:"ONGOING"},
						{status:"PENDING"},
					]
				},
				include: Subject
			})
			const credit = await creditTotal(checkCredit)
			if(credit<credit_thresh && checkIfSubjectTaken===null){
				await StudentSubject.create({
					subject_id:subject_id,
					student_id:student_id
				})
				res.sendJson(200,true,"Enrolled",)
			}
			if(credit>credit_thresh){
				res.sendJson(400,false,"Exceeded maximum credit",null)
			}
			if(checkIfSubjectTaken!==null){
				res.sendJson(400,false,"Subject already taken",null)
			}
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
};

async function getID(subjectTaken){
	const idReturn = []
	const subjectTakenParsed = JSON.parse(JSON.stringify(subjectTaken))[0].Subjects
	for(let i=0 ; i<test.length; i++){
		idReturn.push(test[i].id)
	}
	return idReturn
}

function recommendation(studentSubjectID,majorSubjectID){
	return majorSubjectID.filter(element=>!studentSubjectID.includes(element))
}

async function creditTotal(checkCredit){
	let credit = 0 
	console.log(checkCredit)
	for(let i=0;i<checkCredit.length;i++){
		credit += checkCredit[i].dataValues.Subject.credits
	}
	return credit
}