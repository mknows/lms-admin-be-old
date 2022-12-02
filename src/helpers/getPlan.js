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

async function getPlan(student_id) {
	const all_dat = await Promise.all([
		await StudentSubject.findAll({
			attributes: ["subject_id"],
			where: {
				student_id: student_id,
				status: DRAFT,
			},
			order: ["created_at"],
		}),
		await StudentSubject.findAll({
			attributes: ["subject_id"],
			where: {
				student_id: student_id,
				status: PENDING,
			},
			order: ["created_at"],
		}),
		await StudentSubject.findAll({
			attributes: ["subject_id"],
			where: {
				student_id: student_id,
				status: ONGOING,
			},
			order: ["created_at"],
		}),
		await StudentSubject.findAll({
			attributes: ["subject_id"],
			where: {
				student_id: student_id,
				status: FINISHED,
			},
			order: ["created_at"],
		}),
	]);

	let plan = {
		datadraft: all_dat[0],
		datapending: all_dat[1],
		dataongoing: all_dat[2],
		datafinished: all_dat[3],
	};
	return plan;
}
module.exports = getPlan;
