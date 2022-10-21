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
require("dotenv").config({
	path: __dirname + "../controllers/controllerconfig.env",
});
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
	let stat = true;
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
		},
		attributes: ["status"],
	});

	let stats_not_acc = [ONGOING, FAILED];

	enroll_data.forEach((dat) => {
		if (dat.length === mod_status_list.length) {
			stat = false;
		}
		if (!stats_not_acc.includes(dat.status)) {
			stat = false;
		}
	});

	return stat;
}

module.exports = lockUpdate;
