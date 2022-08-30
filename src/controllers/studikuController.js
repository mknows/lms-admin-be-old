const {Student, Subject} = require('../models')
const moment = require('moment')

module.exports = {
	/**
	 * @desc      Get All Matakuliah
	 * @route     GET /api/v1/studiku/all
	 * @access    Public
	 */
	getAllStudentSubject: async (req, res) => {
		try {
			const data = await subject.findAll();
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
	 * @route     GET /api/v1/studiku/matakuliahMurid
	 * @access    Private
	 */
	getStudentsSubject: async (req,res) => {
		try {
			let user = req.userData;
			const testStudent = await Student.findAll({
			where: {
				firebaseUID: user.uid
			},
			include: Subject
			})
			
			res.sendJson(200,true,"test", testStudent)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	}
};