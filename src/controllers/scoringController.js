const {
	Student,
	MajorSubject,
	StudentSubject,
	MaterialEnrolled,
	Subject,
	StudentSession,
	Session,
} = require("../models");
require("dotenv").config({ path: __dirname + "/controllerconfig.env" });
const {
	WEIGHT_A,
	WEIGHT_A_MINUS,
	WEIGHT_B_PLUS,
	WEIGHT_B,
	WEIGHT_B_MINUS,
	WEIGHT_C_PLUS,
	WEIGHT_C,
	WEIGHT_C_MINUS,
	WEIGHT_D,
	WEIGHT_E,

	DRAFT,
	PENDING,
	ONGOING,
	GRADING,
	PASSED,
	FAILED,
	FINISHED,
	ABANDONED,
	NOT_ENROLLED,
	INVALID,

	FLOOR_A,
	FLOOR_A_MINUS,
	FLOOR_B_PLUS,
	FLOOR_B,
	FLOOR_B_MINUS,
	FLOOR_C_PLUS,
	FLOOR_C,
	FLOOR_D,
	FLOOR_E,

	KKM,

	MODULE,
	QUIZ,
	ASSIGNMENT,
} = process.env;
const asyncHandler = require("express-async-handler");

module.exports = {
	/**
	 * @desc      calculate final gpa
	 * @access    Private
	 */
	getGPA: asyncHandler(async (student_id) => {
		let score = 0;
		let total_cred = 0;

		let enr = await StudentSubject.findAll({
			where: {
				student_id: student_id,
				status: GRADING,
			},
		});

		for (let i = 0; i < enr.length; i++) {
			let cursub = await Subject.findOne({
				id: enr[i].subject_id,
			});
			score += scoreByLetter(enr[i].final_score, cursub.credit);
			total_cred += cursub.credit;
		}

		return score / total_cred;
	}),

	/**
	 * @desc      calculate progress in a subject
	 * @access    Private
	 */
	getSubjectProgress: asyncHandler(async (student_id, subject_id) => {
		let progress = 0;

		let donelen = 0;
		let totallen = 0;

		let done = await Session.findAll({
			where: {
				subject_id: subject_id,
			},
			include: {
				model: Student,
				where: {
					id: student_id,
				},
				through: {
					where: {
						present: true,
					},
				},
			},
		});

		let total = await Session.findAll({
			where: {
				subject_id: subject_id,
			},
		});

		if (done !== null) {
			donelen = done.length;
		}
		if (total !== null) {
			totallen = total.length;
		}

		if (donelen >= 0 && totallen > 0) {
			progress = (donelen / totallen) * 100;
			progress = Math.round(progress);
		}

		return progress;
	}),

	/**
	 * @desc      calculate Subject score
	 * @access    Private
	 */
	getSubjectScore: asyncHandler(async (student_id, subject_id) => {
		let score = 0;

		let sub = await Subject.findOne({
			where: { id: subject_id },
			attributes: ["number_of_sessions"],
		});

		let finished_sessions = await Student.findOne({
			where: {
				id: student_id,
			},
			include: {
				model: Session,
				where: {
					subject_id: subject_id,
				},
				through: {
					attributes: ["final_score"],
				},
			},
		});

		if (!finished_sessions) {
			return 0;
		}
		for (let i = 0; i < finished_sessions.Sessions.length; i++) {
			let curr_sesh = finished_sessions.Sessions[i].StudentSession;
			let curr_score = curr_sesh.final_score;
			if (curr_score == null) {
				curr_score = 0;
			}

			score += curr_score;
		}

		// TODO: ASSUMING EVERY SESSION IS EQUAL
		score = score / sub.number_of_sessions;

		return score;
	}),

	/**
<<<<<<< HEAD
	 * @desc      calculate Session Score
=======
	 * @desc      calculate Session Score score
>>>>>>> 9a4ac3e (session scoring try 1)
	 * @access    Private
	 */
	getSessionScore: asyncHandler(async (student_id, session_id) => {
		let score = 0;

		let sesh = await Session.findOne({
			where: {
				id: session_id,
			},
		});

		let materials = await Promise.all([
			await MaterialEnrolled.findAll({
				student_id,
				session_id,
				type: MODULE,
			}),
			await MaterialEnrolled.findAll({
				student_id,
				session_id,
				type: QUIZ,
			}),
			await MaterialEnrolled.findAll({
				student_id,
				session_id,
				type: ASSIGNMENT,
			}),
		]);

		let material_score = [];

		for (let i = 0; i < materials.length; i++) {
			let dat_val = 0;
			let amount = 0;
			for (let j = 0; j < materials[i].length; j++) {
				let curr_score = materials[i][j].score;

				if (curr_score == null) {
					curr_score = 0;
				}
				dat_val += curr_score;
				amount += 1;
			}
			material_score.push(dat_val / amount);
		}

<<<<<<< HEAD
		console.log(material_score);

=======
>>>>>>> 9a4ac3e (session scoring try 1)
		return score;
	}),
};

function letterByPercent(percent) {
	if (percent >= parseFloat(FLOOR_A)) {
		return "A";
	} else if (percent >= parseFloat(FLOOR_A_MINUS)) {
		return "A-";
	} else if (percent >= parseFloat(FLOOR_B_PLUS)) {
		return "B+";
	} else if (percent >= parseFloat(FLOOR_B)) {
		return "B";
	} else if (percent >= parseFloat(FLOOR_B_MINUS)) {
		return "B-";
	} else if (percent >= parseFloat(FLOOR_C_PLUS)) {
		return "C+";
	} else if (percent >= parseFloat(FLOOR_C)) {
		return "C";
	} else if (percent >= parseFloat(FLOOR_D)) {
		return "D";
	} else if (percent >= parseFloat(FLOOR_E)) {
		return "E";
	}
	return null;
}

function GPAByLetter(letter, credit) {
	if (letter === "A") {
		return parseFloat(WEIGHT_A) * credit;
	} else if (letter === "A-") {
		return parseFloat(WEIGHT_A_MINUS) * credit;
	} else if (letter === "B+") {
		return parseFloat(WEIGHT_B_PLUS) * credit;
	} else if (letter === "B") {
		return parseFloat(WEIGHT_B) * credit;
	} else if (letter === "B-") {
		return parseFloat(WEIGHT_B_MINUS) * credit;
	} else if (letter === "C+") {
		return parseFloat(WEIGHT_C_PLUS) * credit;
	} else if (letter === "C") {
		return parseFloat(WEIGHT_C) * credit;
	} else if (letter === "C-") {
		return parseFloat(WEIGHT_C_MINUS) * credit;
	} else if (letter === "D") {
		return parseFloat(WEIGHT_D) * credit;
	} else if (letter === "E") {
		return parseFloat(WEIGHT_E) * credit;
	}
	return null;
}
