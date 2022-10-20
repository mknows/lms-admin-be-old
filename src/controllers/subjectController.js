const {
	Student,
	Subject,
	StudentSubject,
	Major,
	Lecturer,
	User
} = require("../models");
const prerequisiteChecker = require("../helpers/prerequsitieChecker")
const checkExistence = require('../helpers/checkExistence')
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
const pagination = require("../helpers/pagination");
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
	 * @route     GET /api/v1/subject/enrolledsubjects/paginate?page=(number)&limit=(number)&search=(str)
	 * @access    Public
	 */
	getEnrolledSubject: asyncHandler(async (req, res) => {
		let { page, limit, search } = req.query;

		let search_query = "%%";

		if (search) {
			search_query = "%" + search + "%";
		}

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
				where: {
					name: { [Op.iLike]: search_query },
				},
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
				score: await scoringController.getSubjectScore(
					student_id,
					subjectsEnrolled[i].Subject.id
				),
			};

			result.push(resval);
		}

		if (page == null) {
			page = 1;
		}

		if (limit == null) {
			limit = result.length;
		}

		result = await pagination(result, page, limit);
		result = { ...result, total_subject: subjectsEnrolled.length };
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
		const { subject_id } = req.params;
		const student_id = req.student_id;

		const storage = getStorage();
		const bucket = admin.storage().bucket();

		const nameFile = uuidv4() + req.file.originalname.split(" ").join("-");
		const fileBuffer = req.file.buffer;
		const credit_thresh = 24;

		let subjectsEnrolled = await getPlan(student_id);
		subjectsEnrolled = subjectsEnrolled[0]
			.concat(subjectsEnrolled[1])
			.concat(subjectsEnrolled[2]);

		const sub = await Subject.findOne({ where: { id: subject_id } });

		const students_major = await Student.findOne({
			where: {
				id: student_id,
			},
			include: {
				model: Major,
				attributes: ["id"],
				include: {
					model: Subject,
					attributes: ["id"],
					where: {
						id: sub.id,
					},
				},
			},
		});
		if (students_major.Majors.length === 0) {
			return res.sendJson(
				400,
				false,
				"Student's major doesn't have that subject"
			);
		}

		const subjectEnrolled = await StudentSubject.findOne({
			where:{
				subject_id,
				student_id
			}
		})
		
		if(subjectEnrolled){
			return res.sendJson(
				400,
				false,
				"Student has already enrolled in that subject"
			);
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
						await StudentSubject.create({
							student_id: student_id,
							subject_id: subject_id,
							proof: nameFile,
							proof_link: linkFile,
							status: DRAFT,
						});
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
		const {subject_id} = req.params;
		const student_id = req.student_id;
		
		const credit_thresh = 24;
		let subjectsEnrolled = await getPlan(student_id);
		subjectsEnrolled = subjectsEnrolled[0]
			.concat(subjectsEnrolled[1])
			.concat(subjectsEnrolled[2]);

		const sub = await Subject.findOne({ where: { id: subject_id } });

		if(!checkExistence(Subject,subject_id)){
			return res.sendJson(
				400,
				false,
				"Subject doesnt exist"
			);
		}
		const students_major = await Student.findOne({
			where: {
				id: student_id,
			},
			include: {
				model: Major,
			},
		});
		if (students_major.Majors.length === 0) {
			return res.sendJson(
				400,
				false,
				"Student's major doesn't have that subject"
			);
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

		let result;

		if (enrolled === false && credit <= credit_thresh) {
			await StudentSubject.create({
				subject_id: subject_id,
				student_id: student_id,
				status: DRAFT,
			});

			result = await getParsedPlan(student_id);
			return res.sendJson(
				200,
				true,
				`successfully enrolled in ${sub.name}`,
				result
			);
		} else if (credit > credit_thresh) {
			return res.sendJson(400, false, "Exceeded maximum credit", {
				credit: credit,
			});
		} else if (enrolled) {
			return res.sendJson(400, false, `already enrolled in ${sub.name}`, {
				enrolled_in: subject_id,
			});
		}

		if (credit > credit_thresh) {
			return res.sendJson(400, false, "Exceeded maximum credit", {
				credit: credit,
			});
		} else if (enrolled) {
			return res.sendJson(400, false, `already enrolled in ${sub.name}`, {
				enrolled_in: subject_id,
			});
		} else if (enrolled === false && credit <= credit_thresh) {
			await StudentSubject.create({
				subject_id: subject_id,
				student_id: student_id,
				status: DRAFT,
			});

			result = await getParsedPlan(student_id);
			return res.sendJson(
				200,
				true,
				`successfully enrolled in ${sub.name}`,
				result
			);
		}
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
				status: PENDING,
			},
			{
				where: {
					id: student_id,
					status: DRAFT,
				},
			}
		);
		let studyplan = await getParsedPlan(student_id);
		return res.sendJson(200, true, "Sent Draft", studyplan);
	}),
	/**
	 * @desc      enroll in a subject
	 * @route     DELETE /api/v1/subject/deleteDraft/:subject_id
	 * @access    Private
	 */
	deleteDraft: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const {	subject_id } = req.params;

		const exists = StudentSubject.findOne({
			where: {
				subject_id,
				student_id
			},
		});
		if (!exists) {
			return res.sendJson(400, false, "Draft doesn't exist");
		}
		await StudentSubject.destroy({
			where: {
				student_id: student_id,
				subject_id: subject_id,
				status: DRAFT,
			},
			force: true,
		});

		let studyplan = await getParsedPlan(student_id);
		return res.sendJson(200, true, "Draft Deleted", studyplan);
	}),
	/**
	 * @desc      get plan
	 * @route     POST
	 * @access    Private
	 */
	getStudyPlan: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const subjects_enrolled = await getParsedPlan(student_id);

		const students_information = await Student.findOne({
			where: {
				id: student_id,
			},
			include: [
				{
					model: User,
					attributes: ["full_name"],
				},
				{
					model: Major,
					attributes: ["name"],
				},
				{
					model: Lecturer,
					include: [
						{
							model: User,
							attributes: ["full_name"],
						},
					],
				},
			],
		});
		let result = {
			studentsInformation: students_information,
			subjects_enrolled: subjects_enrolled,
		};

		return res.sendJson(200, true, "success", result);
	}),
};

async function getPlan(student_id) {
	const datapending = await StudentSubject.findAll({
		attributes: ["subject_id"],
		where: {
			student_id: student_id,
			status: PENDING,
		},
		order: ["created_at"],
	});
	const dataongoing = await StudentSubject.findAll({
		attributes: ["subject_id"],
		where: {
			student_id: student_id,
			status: ONGOING,
		},
		order: ["created_at"],
	});
	const datadraft = await StudentSubject.findAll({
		attributes: ["subject_id"],
		where: {
			student_id: student_id,
			status: DRAFT,
		},
		order: ["created_at"],
	});

	let plan = [datapending, dataongoing, datadraft];
	return plan;
}

async function getParsedPlan(student_id) {
	const subjectsEnrolled = await getPlan(student_id);

	const datapending = subjectsEnrolled[0];
	const dataongoing = subjectsEnrolled[1];
	const datadraft = subjectsEnrolled[2];

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
			subject_id: currSub.id,
			student_subject_id: currStudSub.id,
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
			subject_id: currSub.id,
			student_subject_id: currStudSub.id,
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
			subject_id: currSub.id,
			student_subject_id: currStudSub.id,
		};

		draftres.push(dataval);
	}

	let total_plan_cred = pendingcred + ongoingcred + draftcred;

	return {
		pending: { subjects: pendingres, credit: pendingcred },
		ongoing: { subjects: ongoingres, credit: ongoingcred },
		draft: { subjects: draftres, credit: draftcred },
		total_credit: total_plan_cred,
	};
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
