const { Op } = require("sequelize");
const {
	Major,
	Subject,
	MajorSubject,
	StudentMajor,
	StudentSubject,
	Student,
	User,
	Lecturer,
	StudentSession,
} = require("../models");
const scoringController = require("../controllers/scoringController");
require("dotenv").config();
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
	NOT_ENROLLED,

	QUIZ,
	MODULE,
} = process.env;

async function getStudentOngoingSessionId(student_id) {
	let result = [];
	let sesh_ong = await StudentSession.findAll({
		attributes: ["id"],
		where: {
			student_id: student_id,
		},
	});

	for (let i = 0; i < sesh_ong.length; i++) {
		result.push(sesh_ong[i].id);
	}
	return result;
}
module.exports = getStudentOngoingSessionId;
