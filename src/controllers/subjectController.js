const {
	Student,
	Subject,
	StudentSubject,
	Major,
	Lecturer,
	User,
} = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const {
	getStorage,
	ref,
	getDownloadURL,
	deleteObject,
} = require("firebase/storage");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const scoringController = require("./scoringController");
const {
	DRAFT,
	PENDING,
	ONGOING,
	GRADING,
	PASSED,
	FAILED,
	FINISHED,
	ABANDONED,
} = process.env;

module.exports = {
	// this should make it
	/**
	 * @desc      create subjects
	 * @route     POST /api/v1/subject/create
	 * @access    Public
	 */
	createSubject: asyncHandler(async (req, res) => {
		const {
			name,
			number_of_sessions,
			level,
			lecturer,
			description,
			credit,
			degree,
		} = req.body;
		const storage = getStorage();
		const bucket = admin.storage().bucket();

		if (
			!name ||
			!number_of_sessions ||
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
			level: level,
			lecturer: lecturer,
			description: description,
			credit: credit,
			degree: degree,
		});

		const thumbnailFileName =
			"images/thumbnail/" +
			uuidv4() +
			req.file.originalname.split(" ").join(" ");
		const thumbnailFileBuffer = req.file.buffer;

		bucket
			.file(thumbnailFileName)
			.createWriteStream()
			.end(thumbnailFileBuffer)
			.on("finish", () => {
				getDownloadURL(ref(storage, thumbnailFileName)).then(
					async (linkFile) => {
						await Subject.update(
							{
								thumbnail: thumbnailFileName,
								thumbnail_link: linkFile,
							},
							{
								where: {
									id: data.id,
								},
							}
						);
					}
				);
			});

		return res.sendJson(200, true, "sucess make subject", data);
	}),
	/**
	 * @desc      Get All subject
	 * @route     GET /api/v1/subject/
	 * @access    Public
	 */
	getAllSubject: asyncHandler(async (req, res) => {
		const data = await Subject.findAll();
		return res.sendJson(200, true, "sucess get all data", data);
	}),
	/**
	 * @desc      Get subject
	 * @route     GET /api/v1/subject/:subject_id
	 * @access    Public
	 */
	getSubject: asyncHandler(async (req, res) => {
		const { subject_id } = req.params;
		const data = await Subject.findOne({
			where: {
				id: subject_id,
			},
		});
		return res.sendJson(200, true, "sucess get subject", data);
	}),
	/**
	 * @desc      Get enrolled subject
	 * @route     GET /api/v1/subject/enrolledsubjects
	 * @access    Public
	 */
	getEnrolledSubject: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const subjectsEnrolled = await StudentSubject.findAll({
			where: {
				student_id: student_id,
				status: ONGOING,
			},
			include: {
				model: Subject,
				attributes: [
					"id",
					"name",
					"number_of_sessions",
					"level",
					"indicator",
					"teaching_materials",
					"credit",
					"lecturer",
					"thumbnail_link",
				],
			},
			attributes: {
				exclude: [
					"updated_by",
					"created_by",
					"deleted_at",
					"created_at",
					"updated_at",
				],
			},
		});

		let result = [];

		for (let i = 0; i < subjectsEnrolled.length; i++) {
			let lect = subjectsEnrolled[i].Subject.lecturer;

			let leturers = [];

			for (let i = 0; i < lect.length; i++) {
				leturers.push(lect[i]);
			}

			let teachers = await Lecturer.findAll({
				where: {
					id: leturers,
				},
				attributes: [],
				include: {
					model: User,
					attributes: ["full_name"],
				},
			});

			let teach = [];

			for (let i = 0; i < teachers.length; i++) {
				teach.push(teachers[i].User.full_name);
			}

			let progress = await scoringController.getSubjectProgress(
				req.student_id,
				subjectsEnrolled[i].Subject.id
			);

			const { count, rows } = await StudentSubject.findAndCountAll({
				where: {
					subject_id: subjectsEnrolled[i].Subject.id,
					status: ONGOING,
				},
			});

			let resval = {
				item: subjectsEnrolled[i],
				progress: progress,
				student_count: count,
				lecturers: teach,
			};

			result.push(resval);
		}
		return res.sendJson(200, true, "sucess get subject", result);
	}),
	/**
	 * @desc      Edit Subject
	 * @route     PUT /api/v1/subject/edit/:subject_id
	 * @access    Private (Admin)
	 */
	editSubject: asyncHandler(async (req, res) => {
		const { subject_id } = req.params;
		let {
			name,
			number_of_sessions,
			level,
			lecturer,
			description,
			credit,
			degree,
		} = req.body;
		const storage = getStorage();
		const bucket = admin.storage().bucket();

		const study = await Subject.findOne({
			where: { id: subject_id },
		});

		if (!study) {
			return res.status(404).json({
				success: false,
				message: "Invalid subject_id.",
				data: {},
			});
		}

		if (req.file) {
			if (study.thumbnail) {
				deleteObject(ref(storage, study.thumbnail));
			}

			const thumbnailFileName =
				"images/thumbnail/" +
				uuidv4() +
				req.file.originalname.split(" ").join(" ");
			const thumbnailFileBuffer = req.file.buffer;

			bucket
				.file(thumbnailFileName)
				.createWriteStream()
				.end(thumbnailFileBuffer)
				.on("finish", () => {
					getDownloadURL(ref(storage, thumbnailFileName)).then(
						async (linkFile) => {
							await Subject.update(
								{
									thumbnail: thumbnailFileName,
									thumbnail_link: linkFile,
								},
								{
									where: {
										id: study.id,
									},
								}
							);
						}
					);
				});
		}

		if (name === null) {
			name = study.name;
		}
		if (number_of_sessions == null) {
			number_of_sessions = study.number_of_sessions;
		}
		if (level === null) {
			level = study.level;
		}
		if (lecturer === null) {
			lecturer = study.lecturer;
		}
		if (description === null) {
			description = study.description;
		}
		if (credit === null) {
			credit = study.credit;
		}
		if (degree === null) {
			degree = study.degree;
		}

		const data = await Subject.update(
			{
				name,
				number_of_sessions,
				level,
				lecturer,
				description,
				credit,
				degree,
			},
			{
				where: { id: subject_id },
				returning: true,
				plain: true,
			}
		);

		return res.status(200).json({
			success: true,
			message: `Edit Subject with ID ${subject_id} successfully.`,
			data: { ...data[1].dataValues },
		});
	}),
	/**
	 * @desc      Delete Subject
	 * @route     DELETE /api/v1/subject/delete/:subject_id
	 * @access    Private (Admin)
	 */
	removeSubject: asyncHandler(async (req, res, next) => {
		const { subject_id } = req.params;
		const storage = getStorage();

		let data = await Subject.findOne({
			where: { id: subject_id },
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid subject_id.",
				data: {},
			});
		}

		if (data.thumbnail) {
			deleteObject(ref(storage, data.thumbnail));
		}

		Subject.destroy({
			where: { id: subject_id },
		});

		return res.status(200).json({
			success: true,
			message: `Delete Subject with ID ${subject_id} successfully.`,
			data: {},
		});
	}),
	/**
	 * @desc      Post poof exist KHS
	 * @route     POST /api/v1/subject/uploadkhs/:subject_id
	 * @access    Private (user)
	 */
	existKhsUpload: asyncHandler(async (req, res) => {
		const {subject_id} = req.params;
		const student_id = req.student_id;
		
		const storage = getStorage();
		const bucket = admin.storage().bucket();

		const nameFile = uuidv4() + req.file.originalname.split(" ").join("-");
		const fileBuffer = req.file.buffer;

		// bucket
		// 	.upload("documents/khs/", {
		// 		gzip: true,
		// 		destination: nameFile,
		// 	})
		// 	.then((res) => {
		// 		console.log("res => ", res);
		// 	})
		// 	.catch((err) => console.log(err));
		const credit_thresh = 24;
		let subjectsEnrolled = await getPlan(student_id);
		subjectsEnrolled = subjectsEnrolled[0]
			.concat(subjectsEnrolled[1])
			.concat(subjectsEnrolled[2]);

		const sub = await Subject.findOne({ where: { id: subject_id } });

		const studentMajor = await Student.findOne({
			attributes: ["major_id"],
			where: {
				id: student_id,
			},
		});
		const majorSubject = await Major.findAll({
			attributes: ["id"],
			where: {
				id: studentMajor.dataValues.major_id,
			},
			include: [
				{
					model: Subject,
					where: {
						id: subject_id,
					},
				},
			],
		});
		if (!majorSubject) {
			return res.sendJson(400, false, "Student is not in that major", null);
		}
		let credit = 0;
		let enrolled = false;

		if (subjectsEnrolled !== null) {
			credit = await totalCredit(subjectsEnrolled);
			enrolled = await isEnrolled(subjectsEnrolled, sub.id);
		}

		if (sub !== null) {
			credit += sub.credit;
		}
		if (enrolled === false && credit <= credit_thresh) {
			bucket
			.file(nameFile)
			.createWriteStream()
			.end(fileBuffer)
			.on("finish", () => {
				console.log("Lanjut finish ini");
				getDownloadURL(ref(storage, nameFile)).then(async (linkFile) => {
					console.log("link nya => ", linkFile);
					await StudentSubject.create(
						{
							student_id : student_id,
							subject_id : subject_id,
							proof: nameFile,
							proof_link: linkFile,
							status: DRAFT
						}
					);
				});
			});		
			return res.sendJson(200, true, "Enrolled Subject");
		} else if (credit > credit_thresh) {
			return res.sendJson(400, false, "Exceeded maximum credit", {
				credit: credit,
			});
		} else if (enrolled) {
			return res.sendJson(400, false, "Subject already taken", {
				enrolled_in: subject_id,
			});
		}
		return res.sendJson(200, true, "success upload khs");
	}),

	// Student Specific
	/**
	 * @desc      Get subjects of student
	 * @route     GET /api/v1/subject/forstudent
	 * @access    Private
	 */
	getSubjectForStudent: asyncHandler(async (req, res) => {
		const user_id = req.userData.id;

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
		const majorsubject_id = await getID(majorSubject);

		const result = recommendation(subjectTakenID, majorsubject_id);

		return res.sendJson(200, true, "Success", result);
	}),
	/**
	 * @desc      enroll in a subject
	 * @route     POST /api/v1/subject/enroll/:subject_id
	 * @access    Private
	 */
	takeSubject: asyncHandler(async (req, res) => {
		const { subject_id } = req.params;
		const student_id = req.student_id;
		const credit_thresh = 24;
		let subjectsEnrolled = await getPlan(student_id);
		subjectsEnrolled = subjectsEnrolled[0]
			.concat(subjectsEnrolled[1])
			.concat(subjectsEnrolled[2]);

		const sub = await Subject.findOne({ where: { id: subject_id } });

		const studentMajor = await Student.findOne({
			attributes: ["major_id"],
			where: {
				id: student_id,
			},
		});
		const majorSubject = await Major.findAll({
			attributes: ["id"],
			where: {
				id: studentMajor.dataValues.major_id,
			},
			include: [
				{
					model: Subject,
					where: {
						id: subject_id,
					},
				},
			],
		});
		if (!majorSubject) {
			return res.sendJson(400, false, "Student is not in that major", null);
		}
		let credit = 0;
		let enrolled = false;

		if (subjectsEnrolled !== null) {
			credit = await totalCredit(subjectsEnrolled);
			enrolled = await isEnrolled(subjectsEnrolled, sub.id);
		}

		if (sub !== null) {
			credit += sub.credit;
		}

		if (enrolled === false && credit <= credit_thresh) {
			await StudentSubject.create({
				subject_id: subject_id,
				student_id: student_id,
				status: DRAFT,
			});
			return res.sendJson(200, true, "Enrolled Subject");
		} else if (credit > credit_thresh) {
			return res.sendJson(400, false, "Exceeded maximum credit", {
				credit: credit,
			});
		} else if (enrolled) {
			return res.sendJson(400, false, "Subject already taken", {
				enrolled_in: subject_id,
			});
		}
		return res.sendJson(400, false, "something went wrong", null);
	}),
	/**
	 * @desc      enroll in a subject
	 * @route     PUT /api/v1/subject/sendDraft
	 * @access    Private
	 */
	sendDraft: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		await StudentSubject.update(
			{
				status: PENDING
			},
			{
				where: {
					id: student_id,
					status: DRAFT,
				},
			}
		);
		return res.sendJson(200, true, "Sent Draft");
	}),
	/**
	 * @desc      enroll in a subject
	 * @route     DELETE /api/v1/subject/deleteDraft/:student_subject_id
	 * @access    Private
	 */
	deleteDraft: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const { student_subject_id } = req.params;

		const exists= StudentSubject.findOne({
			where: {
				id: student_subject_id,
			},
		});
		if(!exists){
			return res.sendJson(400, false, "Draft doesn't exist");
		}
		await StudentSubject.destroy({
			where: {
				student_id: student_id,
				id: student_subject_id,
				status: DRAFT,
			},
			force: true,
		});
		return res.sendJson(200, true, "Draft Deleted");
	}),
	/**
	 * @desc      get plan
	 * @route     POST /api/v1/subject/studyplan
	 * @access    Private
	 */
	getStudyPlan: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const subjectsEnrolled = await getPlan(student_id);

		const datapending = subjectsEnrolled[0];
		const dataongoing = subjectsEnrolled[1];
		const datadraft = subjectsEnrolled[2];

		let credit = 0;

		let draftres = [];
		let draftcred = 0;

		let pendingres = [];
		let pendingcred = 0;

		let ongoingres = [];
		let ongoingcred = 0;

		for (let i = 0; i < datapending.length; i++) {
			let currStudSub = datapending[i];

			let currSub = await Subject.findOne({
				where: {
					id: currStudSub.subject_id,
				},
			});

			pendingcred += currSub.credit;

			let dataval = {
				name: currSub.name,
				credit: currSub.credit,
				status: currStudSub.status,
			};

			pendingres.push(dataval);
		}

		for (let i = 0; i < dataongoing.length; i++) {
			let currStudSub = dataongoing[i];

			let currSub = await Subject.findOne({
				where: {
					id: currStudSub.subject_id,
				},
			});

			ongoingcred += currSub.credit;

			let dataval = {
				name: currSub.name,
				credit: currSub.credit,
				status: currStudSub.status,
			};

			ongoingres.push(dataval);
		}

		for (let i = 0; i < datadraft.length; i++) {
			let currStudSub = datadraft[i];

			let currSub = await Subject.findOne({
				where: {
					id: currStudSub.subject_id,
				},
			});

			draftcred += currSub.credit;

			let dataval = {
				name: currSub.name,
				credit: currSub.credit,
				status: currStudSub.status,
			};

			draftres.push(dataval);
		}

		let total_plan_cred = pendingcred + ongoingcred + draftcred;

		return res.sendJson(200, true, "success", {
			pending: { subjects: pendingres, credit: pendingcred },
			ongoing: { subjects: ongoingres, credit: ongoingcred },
			draft: { subjects: draftres, credit: draftcred },
			total_credit: total_plan_cred,
		});
	}),
};

async function getPlan(student_id) {
	const datapending = await StudentSubject.findAll({
		where: {
			student_id: student_id,
			status: PENDING,
		},
	});
	const dataongoing = await StudentSubject.findAll({
		where: {
			student_id: student_id,
			status: ONGOING,
		},
	});
	const datadraft = await StudentSubject.findAll({
		where: {
			student_id: student_id,
			status: DRAFT,
		},
	});

	let plan = [datapending, dataongoing, datadraft];
	return plan;
}

async function getID(subjectTaken) {
	const idReturn = [];
	const subjectTakenParsed = JSON.parse(JSON.stringify(subjectTaken))[0]
		.Subjects;
	for (let i = 0; i < test.length; i++) {
		idReturn.push(test[i].id);
	}
	return idReturn;
}

function recommendation(studentsubject_id, majorsubject_id) {
	return majorsubject_id.filter(
		(element) => !studentsubject_id.includes(element)
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
