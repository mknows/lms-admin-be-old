const { Student, Subject, StudentSubject, Major } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");

module.exports = {
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/subject/create
	 * @access    Public
	 */
	postSubject: async (req, res) => {
		const {
			name,
			number_of_sessions,
			program,
			level,
			lecturer,
			description,
			credit,
		} = req.body;
		try {
			const data = await Subject.create({
				name: name,
				number_of_sessions: number_of_sessions,
				program: program,
				level: level,
				lecturer: lecturer,
				description: description,
				credit: credit,
			});
			res.sendJson(200, true, "sucess make subject", data);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      Get All subject
	 * @route     GET /api/v1/subject/getall
	 * @access    Public
	 */
	getAllSubject: async (req, res) => {
		try {
			const data = await Subject.findAll();
			res.sendJson(200, true, "sucess get all data", data);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},

	/**
	 * @desc      Get subjects of student
	 * @route     GET /api/v1/subject/forstudent
	 * @access    Private
	 */
	getSubjectForStudent: async (req, res) => {
		const user_id = req.userData.id;
		try {
			const subjectTaken = await Student.findAll({
				where: {
					id: user_id,
				},
				include: [Major, Subject],
			});
			const subjectTakenID = await getID(subjectTaken);

			const majorSubject = await Major.findAll({
				include: Subject,
			});
			const majorSubjectID = await getID(majorSubject);

			const result = recommendation(subjectTakenID, majorSubjectID);

			res.sendJson(200, true, "Success", result);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	// TODO: STILL VERY NAIVE, WILL BE REFACTORED LATER
	/**
	 * @desc      enroll in a subject
	 * @route     POST /api/v1/subject/enroll
	 * @access    Private
	 */
	takeSubject: async (req, res) => {
		const { subject_id } = req.body;
		const student_id = req.userData.id;
		const credit_thresh = 24;
		try {
			const subjectsEnrolled = await StudentSubject.findAll({
				where: {
					student_id: student_id,
					// status: {[Op.or]: ['PENDING', 'ONGOING']}
					[Op.or]: [{ status: "ONGOING" }, { status: "PENDING" }],
				},
			});

			const sub = await Subject.findOne({ where: { id: subject_id } });

			// const hasEnrolled = await alreadyEnrolled(subjectsEnrolled, sub);
			// const credit = await creditTaken(subjectsEnrolled, sub);

			let enrolled = false;
			let credit = 0;
			for (let i = 0; i < subjectsEnrolled.length; i++) {
				const current_subject = await Subject.findOne({
					where: {
						id: subjectsEnrolled[i].subject_id,
					},
				});
				if (current_subject !== null) {
					credit += current_subject.credit;
				}

				if (subjectsEnrolled[i].subject_id === subject_id) {
					enrolled = true;
				}
			}
			if (sub !== null) {
				credit += sub.credit;
			}

			if (enrolled === false && credit <= credit_thresh) {
				await StudentSubject.create({
					subject_id: subject_id,
					student_id: student_id,
					status: "PENDING",
				});
				res.sendJson(200, true, "Enrolled test", credit);
			} else if (credit > credit_thresh) {
				res.sendJson(400, false, "Exceeded maximum credit", { credit: credit });
			} else if (enrolled) {
				res.sendJson(400, false, "Subject already taken", {
					enrolled_in: subject_id,
				});
			} else {
				res.sendJson(400, false, "something went wrong", null);
			}
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
};

async function getID(subjectTaken) {
	const idReturn = [];
	const subjectTakenParsed = JSON.parse(JSON.stringify(subjectTaken))[0]
		.Subjects;
	for (let i = 0; i < test.length; i++) {
		idReturn.push(test[i].id);
	}
	return idReturn;
}

function recommendation(studentSubjectID, majorSubjectID) {
	return majorSubjectID.filter(
		(element) => !studentSubjectID.includes(element)
	);
}

async function creditTaken(subjectTaken, sub) {
	let credit = 0;
	for (let i = 0; i < subjectTaken.length; i++) {
		const subb = await Subject.findOne({
			where: {
				id: subjectTaken[i],
			},
		});
		credit += subb.credit;
	}

	if (sub !== "NONE") {
		credit += sub;
	}

	return credit;
}

async function alreadyEnrolled(subjectTaken, sub) {
	let enrolled = false;
	for (let i = 0; i < subjectTaken.length; i++) {
		console.log(subjectTaken[i]);
		if (sub === subjectTaken[i]) {
			enrolled = true;
		}
	}
	return enrolled;
}
