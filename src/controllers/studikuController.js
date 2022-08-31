const {Student, Subject, Material_Enrolled,Module,Video,Document,Quiz} = require('../models')
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
	 * @route     GET /api/v1/studiku/makeQuiz
	 * @access    Private
	 */
	 postQuizAnswer: async (req,res) => {
		const {answer,quiz_id} = req.body
		const userAnswer = answer
		const user_id = req.userData.dataValues.id;
		let correct=0
		const quiz = await Quiz.findAll({
			where: {
				id: quiz_id
			},
			attributes:[
				'answer','session_id', 'duration'
			]
		})
		const quizAns = quiz[0].dataValues.answer
		const session_id = quiz[0].dataValues.session_id
		const duration = quiz[0].dataValues.duration
		for(var i = 0, l = quizAns.length ; i<l;i++ ){
			if(userAnswer[i]===quizAns[i]){
				correct++
			}
		}
		const score = (correct / quizAns.length) * 100
		try {
			const result = await Material_Enrolled.create({
			student_id:user_id,
			session_id:session_id,
			material_id:"1",
			duration:duration,
			status:"wow",
			answer:answer,
			score:score,
		})
			res.sendJson(200,true,"Success", result)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
};