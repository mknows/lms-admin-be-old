const {
	StudentSession,
	Session,
	Student,

	Quiz,
	Assignment,
	Module,
	DisscussionForum,
	Comment,
	Reply,

	MaterialEnrolled,
	User,
} = require("../models");
const moment = require("moment");
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

async function lockUpdate(student_id, session_id) {
	let modules = await Module.findAll({
		where: {
			session_id,
		},
		attributes: ["id"],
	});

	let mod_status_list = [];

	for (let i = 0; i < modules.length; i++) {
		mod_status_list.push(modules[i].id);
	}

	let enroll_data = await MaterialEnrolled.findAll({
		where: {
			id_referrer: mod_status_list,
			student_id,
		},
		attributes: ["status"],
	});

	let stats_not_acc = ["ONGOING", "FAILED"];

	if (enroll_data.length < mod_status_list.length) {
		return true;
	}
	for (j = 0; j < enroll_data.length; j++) {
		if (stats_not_acc.includes(enroll_data[j].status)) {
			return true;
		}
	}
	return false;
}
async function progress(student_id, session_id, type) {
	const progress = await MaterialEnrolled.findOne({
		attributes: {
			include: ["status"],
		},
		where: {
			student_id,
			session_id,
			type,
		},
	});
	const eligible_status = ["GRADING", "PASSED", "FAILED", "LATE", "FINISHED"];
	if (eligible_status.includes(progress?.status)) {
		return true;
	} else {
		return false;
	}
}

module.exports = { lockUpdate, progress };
