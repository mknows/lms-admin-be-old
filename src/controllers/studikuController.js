const {Student, Subject, Material_Enrolled,Module,Video,Document,Quiz,StudentSubject
} = require('../models')
const moment = require('moment')

module.exports = {
	/**
	 * @desc      Get All Matakuliah
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
	 * @desc      Get Matakuliah murid
	 * @route     GET /api/v1/studiku/studentsSubject
	 * @access    Private
	 */
	getStudentsSubject: async (req,res) => {
		try {
			let userID = req.userData.dataValues.id;
			console.log(userID)
			const studentsSubject = await Student.findAll({
				where: {
					id: userID
				},
				include: Subject
			})	
			res.sendJson(200,true,"Success", studentsSubject)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      Get Matakuliah murid
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
	 * @desc      Get Matakuliah murid
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
	 * @desc      Get Matakuliah murid
	 * @route     GET /api/v1/studiku/makeQuiz
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
			res.sendJson(200,true,"Success", quizzDesc)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      Get Matakuliah murid
	 * @route     GET /api/v1/studiku/takeQuiz/:id
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
	 * @desc      Get Matakuliah murid
	 * @route     GET /api/v1/studiku/postQuizAnswer
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
	 * @desc      Get Matakuliah murid
	 * @route     GET /api/v1/studiku/getAssignment/:id
	 * @access    Private
	 */
	 getAssignment: async (req,res) => {
		const {session_id,duration,description,questions,answer} = req.body
		const assignmentID = req.params.id
		try {
			const quizzDesc = await Quiz.create({
			session_id:session_id,
			duration:duration,
			description:description,
			questions:questions,
			answer:answer
		})
			res.sendJson(200,true,"Success", quizzDesc)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      Get Matakuliah murid
	 * @route     GET /api/v1/studiku/postAssignment
	 * @access    Private
	 */
	postAssignment: async (req,res) => {
		const {session_id,duration,description,questions,answer} = req.body
		const assignmentID = req.params.id
		try {
			const quizzDesc = await Quiz.create({
			session_id:session_id,
			duration:duration,
			description:description,
			questions:questions,
			answer:answer
		})
			res.sendJson(200,true,"Success", quizzDesc)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	
	/**
	 * @desc      Get Matakuliah murid
	 * @route     POST /api/v1/studiku/takeSubject
	 * @access    Private
	 */
	 takeSubject: async (req,res) => {
		const user_id = req.userData.id
		const {subject_id} = req.body
		const stat = "CURRENTLY TAKING"
		try {
			const credit_thresh = 24;
			let already_taken = false;
			const the_subject = await Subject.findOne({
				where: {
					id:subject_id
				}
			})

			const subjectTakenLog = await StudentSubject.findAll({
				where:{
					student_id:user_id,
					status: stat
				}
			})
			const subjectTaken = []
			let ongoing_credit = 0
			for (let i =0; i< subjectTakenLog.length; i++) {
				const sub = await Subject.findOne({
					where: {
						id: subjectTakenLog[i].subject_id
					}
				})

				subjectTaken.push(sub)
				ongoing_credit += sub.credit

				if (subjectTakenLog[i].subject_id === subject_id) {
					already_taken = true;
				}
			}
			 
			const thresh = ongoing_credit + the_subject.credit;

			if(!already_taken){
				res.sendJson(200,true,"subject already taken", subjectTaken)
			} 
			else if(thresh < credit_thresh){
				res.sendJson(200,true,"not enough credit", subjectTaken)
			}
			else {
				const result = await StudentSubject.create({
				subject_id:subject_id,
				student_id:user_id,
				date_taken: moment().format(),
				status: stat
			})
			subjectTaken.push(result)
			res.sendJson(200,true,"Success", subjectTaken)
			}
			
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
};