const { MaterialEnrolled, Assignment, Session, Subject } = require("../models");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const moment = require("moment");

module.exports = {
	/**
	 * @desc      Create new certificate SUBJECT
	 * @route     POST /api/v1/calendar/all
	 * @access    Private
	 **/
	getAllSchedule: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		let schedule = [];
		const all_activities = await MaterialEnrolled.findAll({
			attributes: ["created_at", "type", "id_referrer"],
			where: {
				student_id,
				status: "ONGOING",
			},
			include: {
				model: Session,
				attributes: ["session_no"],
				include: {
					model: Subject,
					attributes: ["name"],
				},
			},
		});
		for (const material_enrolled of all_activities) {
			const endAt =
				material_enrolled.type === "ASSIGNMENT"
					? await AssignmentEndAt(
							material_enrolled.created_at,
							material_enrolled.id_referrer
					  )
					: material_enrolled.created_at;
			schedule.push({
				id: material_enrolled.id_referrer,
				startAt: material_enrolled.created_at,
				endAt,
				summary:
					material_enrolled.Session.Subject.name +
					" Session no. " +
					material_enrolled.Session.session_no +
					", " +
					material_enrolled.type,
				color:
					material_enrolled.type === "ASSIGNMENT"
						? "indigo"
						: material_enrolled.type === "QUIZ"
						? "dodgerblue"
						: "indigo",
				allDay: material_enrolled.created_at === endAt,
			});
		}
		return res.sendJson(200, true, "Success", schedule);
	}),
};
async function AssignmentEndAt(started_at, id_referrer) {
	let date = new Date(started_at);
	const assignment = await Assignment.findOne({
		attributes: ["duration"],
		where: {
			id: id_referrer,
		},
	});
	let result = new Date(
		date.setHours(date.getHours() + assignment.duration / 3600)
	);
	return new Date(result);
}
