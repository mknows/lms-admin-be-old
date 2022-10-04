const {
	Student,
	MajorSubject,
	StudentSubject,
	Materials_Enrolled,
	Subject,
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
} = process.env;
const asyncHandler = require("express-async-handler");

module.exports = {
	/**
	 * @desc      calculate
	 * @route     GET /api/v1/profile/me
	 * @access    Private
	 */
	getTotalScore: asyncHandler(async (req, res) => {
		const user = req.userData;

		let score = 0;

		let enr = await StudentSubject.findAll({
			where: {
				student_id: req.student_id,
				status: GRADING,
			},
		});

		for (let i = 0; i < enr.length; i++) {
			let cursub = await Subject.findOne({
				id: enr[i].subject_id,
			});
			score += scoreByLetter(enr[i].final_score, cursub.credit);
		}

		return res.status(200).json({
			success: true,
			message: "get score",
			data: score,
		});
	}),
};

function scoreByLetter(letter, credit) {
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
}
