const {
    Student, 
	Subject, 
	StudentSubject,
	Major
} = require('../models')
const moment = require('moment')
const {Op} = require("sequelize")

module.exports = {
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/subject/create
	 * @access    Public
	 */
	postSubject: async (req, res) => {
        const {name, 
            number_of_sessions, 
            program, 
            level, 
            lecturer, 
            description,
			credit} = req.body
		try {
			const data = await Subject.create({
                name: name,
                number_of_sessions:number_of_sessions,
                program: program,
                level: level,
                lecturer: lecturer,
                description: description,
				credit: credit
            })
			res.sendJson(
				200, 
				true, 
				"sucess make subject", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      Get All subject
	 * @route     GET /api/v1/subject/getall
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
	 * @desc      Get subjects of student
	 * @route     GET /api/v1/subject/forstudent
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
	 * @route     POST /api/v1/subject/enroll
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
			const subjectsEnrolled = await StudentSubject.findAll({
				where: {
					student_id:student_id,
					[Op.or]:[
						{status:"ONGOING"},
						{status:"PENDING"},
					]
				},
				include: Subject
			})
			const sub = await Subject.findOne({
				where: {
					id: subject_id
				}
			})
			const credit = await creditTotal(subjectsEnrolled) + sub.dataValues.Subject.credit
			if(credit<=credit_thresh && checkIfSubjectTaken===null){
				await StudentSubject.create({
					subject_id:subject_id,
					student_id:student_id,
                    status:"PENDING"
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
	//=====================================================================================
	/**
	 * @desc      enroll in a subject
	 * @route     POST /api/v1/subject/enroll
	 * @access    Private
	 */
	 takeSubject2: async (req,res) => {
		const {subject_id,student_id} = req.body
		const credit_thresh = 24;
		try {
			const subjectsEnrolled = await StudentSubject.findAll({
				where: {
					student_id:student_id,
					[Op.or]:[
						{status:'ONGOING'},
						{status:'PENDING'},
					]
				},
				attributes: [
					'subject_id'
				]
			})
			const sub = await Subject.findOne({
				where: {
					id: subject_id
				}
			}).id;

			// const hasEnrolled = await alreadyEnrolled(subjectsEnrolled, sub);
			// const credit = await creditTaken(subjectsEnrolled, sub);

			let enrolled = false;
			for (let i = 0; i<subjectTaken.length; i++) {
				console.log(subjectTaken[i])
				if (sub === subjectTaken[i]) {
					enrolled = true;
				}
			}

			if(!enrolled){
				await StudentSubject.create({
					subject_id:subject_id,
					student_id:student_id,
                    status:'PENDING'
				})
				res.sendJson(200,true,"Enrolled test")
			}
			else if(credit>credit_thresh){
				res.sendJson(400,false,"Exceeded maximum credit",null)
			}
			else if(hasEnrolled){
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

async function creditTaken(subjectTaken, sub){
	let credit = 0 
	for(let i=0;i<subjectTaken.length;i++){
		const subb = await Subject.findOne({
			where: {
				id: subjectTaken[i]
			}
		})
		credit += subb.credit
	}

	if (sub !== "NONE") {
		credit += sub
	}

	return credit
}

async function alreadyEnrolled(subjectTaken, sub){
	let enrolled = false;
	for (let i = 0; i<subjectTaken.length; i++) {
		console.log(subjectTaken[i])
		if (sub === subjectTaken[i]) {
			enrolled = true;
		}
	}
	return enrolled
}