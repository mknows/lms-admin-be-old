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
const scoringController = require("../controllers/scoringController");
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

async function completedSession(student_id, session_id) {
	let present = false;

	let student_session_data = await StudentSession.findOne({
		where: {
			student_id,
			session_id,
		},
	});

	if (!student_session_data) {
		return present;
	}

	// testttttt

	let sesh = await Session.findOne({
		where: {
			id: session_id,
		},
	});

	// testttttt

	let all_task = await Promise.all([
		Quiz.findAll({
			where: { session_id: session_id },
			attributes: ["id"],
		}),
		Module.findAll({
			where: { session_id: session_id },
			attributes: ["id"],
		}),
		Assignment.findAll({
			where: { session_id: session_id },
			attributes: ["id"],
		}),
	]);

	all_task = [...all_task[0], ...all_task[1], ...all_task[2]];

	const materials_done = [];
	for (let i = 0; i < all_task.length; i++) {
		materials_done.push(
			MaterialEnrolled.findOne({
				where: {
					student_id,
					id_referrer: all_task[i].dataValues.id,
				},
				attributes: ["status"],
			})
		);
	}

	const enroll_data_list = await Promise.all(materials_done);

	let finish_status_list = [];

	for (let i = 0; i < enroll_data_list.length; i++) {
		let enroll_data = enroll_data_list[i];

		let status = NOT_ENROLLED;

		if (enroll_data !== null) {
			status = enroll_data.status;
		}
		finish_status_list.push(status);
	}

	let status_not_finished = [NOT_ENROLLED, ONGOING];

	let intersection = finish_status_list.filter((x) =>
		status_not_finished.includes(x)
	);

	if (intersection === undefined || intersection.length == 0) {
		// array does not exist or is empty (present)
		const score = await scoringController.getSessionScore(
			student_id,
			session_id
		);

		// tesst ------------------------
		const sub_score = await scoringController.getSubjectScoreV2(
			student_id,
			sesh.subject_id
		);
		// tesst -----------------------

		await StudentSession.update(
			{
				status: FINISHED,
				present: true,
				date_present: moment().format("DD/MM/YYYY hh:mm:ss"),
				final_score: score,
			},
			{
				where: {
					id: student_session_data.id,
				},
			}
		);
		present = true;
	}

	return present;
}

module.exports = completedSession;
