const { Op } = require("sequelize");
const { MaterialEnrolled, StudentSession } = require("../models");
const { MODULE, ASSIGNMENT, QUIZ, FINISHED, GRADING, PASSED } = process.env;

async function completedSession(student_id, session_id) {
	const session_completion = await Promise.all([
		MaterialEnrolled.findOne({
			where: {
				student_id: student_id,
				session_id: session_id,
				type: MODULE,
				status: {
					[Op.or]: [FINISHED, GRADING, PASSED],
				},
			},
		}),
		MaterialEnrolled.findOne({
			where: {
				student_id: student_id,
				session_id: session_id,
				type: ASSIGNMENT,
				status: {
					[Op.or]: [FINISHED, GRADING, PASSED],
				},
			},
		}),
		MaterialEnrolled.findOne({
			where: {
				student_id: student_id,
				session_id: session_id,
				type: QUIZ,
				status: {
					[Op.or]: [FINISHED, GRADING, PASSED],
				},
			},
		}),
	]).then((values) => {
		if (!values.includes(null)) {
			StudentSession.update(
				{
					date_present: moment().format("DD/MM/YYYY hh:mm:ss"),
					present: true,
				},
				{
					where: {
						student_id,
						session_id,
					},
				}
			);
		}
	});
}
module.exports = completedSession;
