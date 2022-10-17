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
require("dotenv").config({ path: __dirname + "/controllerconfig.env" });
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

	QUIZ,
	MODULE,
} = process.env;

async function completedSession(student_id, session_id) {
	let present = false;

	let quiz_in_session = await Quiz.findAll({
		where: { session_id: session_id },
		attributes: ["id"],
	});

	let module_in_session = await Module.findAll({
		where: { session_id: session_id },
		attributes: ["id"],
	});

	let assignment_in_session = await Assignment.findAll({
		where: { session_id: session_id },
		attributes: ["id"],
	});

	let df_in_session = await DisscussionForum.findAll({
		where: { session_id: session_id },
	});

	let module_fin = true;
	for (let i = 0; i < module_in_session.length; i++) {
		let material_enrolled_data = await MaterialEnrolled.findOne({
			where: {
				id_referrer: module_in_session[i].id,
				student_id,
				status: FINISHED,
			},
		});
		if (!material_enrolled_data) {
			module_fin = false;
		}
	}

	let quiz_fin = true;
	for (let i = 0; i < quiz_in_session.length; i++) {
		let material_enrolled_data = await MaterialEnrolled.findOne({
			where: {
				id_referrer: quiz_in_session[i].id,
				student_id,
				status: FINISHED,
			},
		});
		if (!material_enrolled_data) {
			quiz_fin = false;
		}
	}

	let assignment_fin = true;
	for (let i = 0; i < assignment_in_session.length; i++) {
		let material_enrolled_data = await MaterialEnrolled.findOne({
			where: {
				id_referrer: assignment_in_session[i].id,
				student_id,
				status: FINISHED,
			},
		});
		if (!material_enrolled_data) {
			assignment_fin = false;
		}
	}

	if (module_fin && quiz_fin && assignment_fin) {
		present = true;
	}
	return present;
}

module.exports = completedSession;
