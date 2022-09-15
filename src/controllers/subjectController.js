const { Student, Subject, StudentSubject, Major } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");

module.exports = {
	/**
	 * @desc      create subjects
	 * @route     POST /api/v1/subject/create
	 * @access    Public
	 */
	postSubject: asyncHandler(async (req, res) => {
		const {
			name,
			number_of_sessions,
			program,
			level,
			lecturer,
			description,
			credit,
			degree,
		} = req.body;
		if (
			!name ||
			!number_of_sessions ||
			!program ||
			!level ||
			!lecturer ||
			!description ||
			!credit ||
			!degree
		) {
			return next(new ErrorResponse("Some fields are missing.", 400));
		}
		if (!lecturer instanceof Array) {
			return next(new ErrorResponse("Invalid lecturer.", 400));
		}
		const data = await Subject.create({
			name: name,
			number_of_sessions: number_of_sessions,
			program: program,
			level: level,
			lecturer: lecturer,
			description: description,
			credit: credit,
			degree: degree,
		});
		return res.sendJson(200, true, "sucess make subject", data);
	}),
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
	 * @desc      Edit Study by ID (Edit data Materi)
	 * @route     PUT /api/v1/subject/edit/:subjectId
	 * @access    Private (Admin)
	 */
	editSubject: asyncHandler(async (req, res) => {
		const { subjectId } = req.params;
		const {
			name,
			number_of_sessions,
			program,
			level,
			lecturer,
			description,
			credit,
			degree,
		} = req.body;

		if (
			!name ||
			!number_of_sessions ||
			!program ||
			!level ||
			!lecturer ||
			!description ||
			!credit ||
			!degree
		) {
			return next(new ErrorResponse("Some fields are missing.", 400));
		}
		if (!lecturer instanceof Array) {
			return next(new ErrorResponse("Invalid lecturer.", 400));
		}
		const study = await Subject.findOne({
			where: { id: subjectId },
		});

		if (!study) {
			return res.status(404).json({
				success: false,
				message: "Invalid subject_id.",
				data: {},
			});
		}

		const data = await Subject.update(
			{
				name,
				description,
				number_of_sessions,
				lecturer_id,
				created_by,
			},
			{
				where: { id: subjectId },
				returning: true,
				plain: true,
			}
		);

		return res.status(200).json({
			success: true,
			message: `Edit Subject with ID ${subjectId} successfully.`,
			data: { ...data[1].dataValues },
		});
	}),
	/**
	 * @desc      Delete Study by ID (Hapus data Materi)
	 * @route     DELETE /api/v1/subject/delete/:subjectId
	 * @access    Private (Admin)
	 */
	removeSubject: asyncHandler(async (req, res, next) => {
		const { subjectId } = req.params;

		let data = await Subject.findOne({
			where: { id: subjectId },
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid subject_id.",
				data: {},
			});
		}

		Subject.destroy({
			where: { id: subjectId },
		});

		return res.status(200).json({
			success: true,
			message: `Delete Subject with ID ${subjectId} successfully.`,
			data: {},
		});
	}),

	// Student Specific
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
					[Op.or]: [{ status: "ONGOING" }, { status: "PENDING" }],
				},
			});

			const sub = await Subject.findOne({ where: { id: subject_id } });

			let credit = 0;
			let enrolled = false;

			// for (let i = 0; i < subjectsEnrolled.length; i++) {
			// 	const current_subject = await Subject.findOne({
			// 		where: {
			// 			id: subjectsEnrolled[i].subject_id,
			// 		},
			// 	});
			// 	if (current_subject !== null) {
			// 		credit += current_subject.credit;
			// 	}
			// }

			if (subjectsEnrolled !== null) {
				credit = await totalCredit(subjectsEnrolled);
				enrolled = await isEnrolled(subjectsEnrolled, sub.id);
			}

			if (sub !== null) {
				credit += sub.credit;
			}
			console.log(credit);
			console.log(enrolled);

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

async function totalCredit(subIdlist) {
	let credit = 0;
	for (let i = 0; i < subIdlist.length; i++) {
		const current_subject = await Subject.findOne({
			where: {
				id: subIdlist[i].subject_id,
			},
		});
		if (current_subject !== null) {
			credit += current_subject.credit;
		}
	}
	return credit;
}

async function isEnrolled(subIdlist, subId) {
	for (let i = 0; i < subIdlist.length; i++) {
		if (subIdlist[i].subject_id === subId) {
			return true;
		}
	}
	return false;
}
