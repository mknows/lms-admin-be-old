const { Subject } = require("../models");
const asyncHandler = require("express-async-handler");

module.exports = {
	/**
	 * @desc      get career path
	 * @route     GET /api/v1/career/get
	 * @access    Private
	 **/
	getCareerPath: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const career_choices = ["doctor", "pilot", "salesman"];
		const subject_choices = [
			"biology",
			"aviation",
			"business",
			"biology II",
			"intermediate aviation",
			"advanced aviation",
			"statistics",
			"international business",
		];
		let career =
			career_choices[Math.floor(Math.random() * career_choices.length)];
		let subjects = getSubject(subject_choices);
		let result = {
			career,
			subjects_taken: subjects.slice(0, 3),
			remaining_subjects: subjects.slice(3, 5),
		};
		return res.sendJson(201, true, result);
	}),
};
function getSubject(subjects) {
	let subject_choices = [];
	for (let i = 0; i < 5; i++) {
		let valid = false;
		while (!valid) {
			let random_subject =
				subjects[Math.floor(Math.random() * subjects.length)];
			if (!subject_choices.includes(random_subject)) {
				subject_choices.push(random_subject);
				valid = true;
			}
		}
	}
	return subject_choices;
}
