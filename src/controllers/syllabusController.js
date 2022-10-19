const {
	Major,
	Subject,
	MajorSubject,
	User,
	Lecturer,
	Student,
	StudentSubject,
} = require("../models");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const pagination = require("../helpers/pagination");
const { redisClient } = require("../helpers/redis");

module.exports = {
	/**
	 * @desc      update module enrolled
	 * @route     PUT /api/v1/syllabus/major/all
	 * @access    Private
	 */
	getAllMajors: asyncHandler(async (req, res) => {
		const major = await Major.findAll({
			attributes: ["id", "name", "description", "head_of_major"],
		});
		const majorSubject = await MajorSubject.findAll({
			attributes: [
				"major_id",
				[
					Sequelize.fn("COUNT", Sequelize.col("major_id")),
					"number_of_subjects",
				],
			],
			group: "major_id",
		});

		for (i = 0; i < major.length; i++) {
			for (j = 0; j < majorSubject.length; j++) {
				if (major[i].dataValues.id === majorSubject[j].dataValues.major_id) {
					major[i].dataValues["number_of_subjects"] =
						majorSubject[j].dataValues.number_of_subjects;
				}
			}
		}
		return res.sendJson(200, true, "Success", major);
	}),
	/**
	 * @desc      get major paginated
	 * @route     GET /api/v1/syllabus/majors/paginate?page=(number)&limit=(number)&search=(str)
	 * @access    Private
	 */
	getAllMajorsPagination: asyncHandler(async (req, res) => {
		const { page, limit, search } = req.query;

		let search_query = "%%";

		if (search) {
			search_query = "%" + search + "%";
		}

		const major = await Major.findAll({
			attributes: ["id", "name", "description", "thumbnail_link"],
			where: {
				name: {
					[Op.iLike]: search_query,
				},
			},
			include: [
				{
					model: Lecturer,
					attributes: ["is_mentor", "is_lecturer", "id"],
					include: [
						{
							model: User,
							attributes: ["full_name"],
						},
					],
				},
			],
		});
		const majorSubject = await MajorSubject.findAll({
			attributes: [
				"major_id",
				[
					Sequelize.fn("COUNT", Sequelize.col("major_id")),
					"number_of_subjects",
				],
			],
			group: "major_id",
		});
		for (i = 0; i < major.length; i++) {
			for (j = 0; j < majorSubject.length; j++) {
				if (major[i].dataValues.id === majorSubject[j].dataValues.major_id) {
					major[i].dataValues["number_of_subjects"] =
						majorSubject[j].dataValues.number_of_subjects;
				}
			}
		}

		const pagedMajor = await pagination(major, page, limit);

		if (pagedMajor === "Data cannot be sliced") {
			return res.sendJson(400, false, pagedMajor, {});
		} else if (pagedMajor === "Limit and / or Page is not an integer") {
			return res.sendJson(400, false, pagedMajor, {});
		}
		return res.sendJson(200, true, "Success", pagedMajor);
	}),
	/**
	 * @desc      update module enrolled
	 * @route     PUT /api/v1/syllabus/subjects/all
	 * @access   Private
	 */
	getAllSubjects: asyncHandler(async (req, res) => {
		const SubjectMajor = await Major.findAll({
			attributes: ["name", "description"],
			include: {
				model: Subject,
				attributes: ["id", "name", "credit", "degree"],
			},
		});
		return res.sendJson(200, true, "Success", SubjectMajor);
	}),
	/**
	 * @desc     get subject paginated
	 * @route    GET /api/v1/syllabus/subjects/paginate?page=(number)&limit=(number)&search=(str)
	 * @access   Private
	 */
	getAllSubjectsPagination: asyncHandler(async (req, res) => {
		const { page, limit, search } = req.query;

		let search_query = "%%";

		if (search) {
			search_query = "%" + search + "%";
		}

		const subjects = await Subject.findAll({
			attributes: [
				"id",
				"name",
				"description",
				"level",
				"thumbnail_link",
				"lecturer",
			],
			where: {
				name: {
					[Op.iLike]: search_query,
				},
			},
		});

		let result = [];

		for (let i = 0; i < subjects.length; i++) {
			let currsub = subjects[i].dataValues;

			let { count, rows } = await StudentSubject.findAndCountAll({
				where: {
					subject_id: currsub.id,
				},
			});
			let lecturer = await Lecturer.findAll({
				where: {
					id: currsub.lecturer,
				},
				include: {
					model: User,
					attributes: ["full_name"],
				},
				attributes: ["id"],
			});

			delete currsub["lecturer"];

			let datval = {
				subject: currsub,
				lecturers: lecturer,
				student_count: count,
			};
			result.push(datval);
		}

		result = await pagination(result, page, limit);
		return res.sendJson(200, true, "Success", result);
	}),

	/**
	 * @desc      update module enrolled
	 * @route     PUT /api/v1/syllabus/subjectByMajor/:major_id
	 * @access   Private
	 */
	subjectByMajor: asyncHandler(async (req, res) => {
		const { major_id } = req.params;
		let subjectByMajor;
		let studentSubject;

		const major = await Major.findOne({
			attributes: ["id"],
			where: {
				id: major_id,
			},
		});
		if (major.length === 0) {
			return res.sendJson(400, false, "Error, Major doesn't exist", {});
		}
		if (major.length !== 0) {
			subjectByMajor = await Subject.findAll({
				attributes: ["id", "name", "level"],
				include: {
					model: Major,
					through: {
						order: ["semester"],
					},
					attributes: ["id", "name", "description"],
					where: {
						id: major_id,
					},
				},
			});
			studentSubject = await Major.findAll({
				where: {
					id: major_id,
				},
				attributes: ["id"],
				include: [
					{
						model: Subject,
						attributes: ["id"],
						include: [
							{
								model: Student,
								attributes: ["user_id"],
							},
						],
					},
				],
			});
			for (i = 0; i < studentSubject[0].dataValues.Subjects.length; i++) {
				const count =
					studentSubject[0].dataValues.Subjects[i].dataValues.Students.length;
				const id = studentSubject[0].dataValues.Subjects[i].dataValues.id;
				for (j = 0; j < subjectByMajor.length; j++) {
					if (subjectByMajor[j].dataValues.id == id) {
						subjectByMajor[j].dataValues["studentEnrolled"] = count;
					}
				}
			}
		}
		return res.sendJson(200, true, "Success", subjectByMajor);
	}),
	/**
	 * @desc      Get subject
	 * @route     GET /api/v1/syllabus/subject/:subject_id
	 * @access    Public
	 */
	getSubject: asyncHandler(async (req, res) => {
		const { subject_id } = req.params;
		let result;
		const key = "getSubject-" + subject_id;

		const cacheResult = await redisClient.get(key);
		if (cacheResult) {
			result = JSON.parse(cacheResult);
		} else {
			const subject = await Subject.findOne({
				attributes: {
					exclude: [
						"created_at",
						"updated_at",
						"deleted_at",
						"updated_by",
						"created_by",
					],
				},
				where: {
					id: subject_id,
				},
			});
			const name = await Lecturer.findAll({
				where: {
					id: {
						[Op.in]: subject.lecturer,
					},
				},
				include: [
					{
						model: User,
					},
				],
			});
			for (i = 0; i < subject.lecturer.length; i++) {
				subject.lecturer = [];
				subject.lecturer.push(name[i].User.dataValues.full_name);
			}
			result = subject;
			await redisClient.set(key, JSON.stringify(result), {
				EX: 120,
			});
		}

		return res.sendJson(200, true, "sucess get subject", result);
	}),
	/**
	 * @desc      Get subject
	 * @route     GET /api/v1/syllabus/getCurrentKRS
	 * @access    Public
	 */
	getKRS: asyncHandler(async (req, res) => {
		let sum = 0;
		const enrolledSubjects = await Student.findAll({
			where: {
				id: "d8ae2586-bd2d-40fd-86d2-9132c0beedce",
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
			],
		});
		for (i = 0; i < enrolledSubjects[0].dataValues.Subjects.length; i++) {
			sum += enrolledSubjects[0].dataValues.Subjects[i].dataValues.credit;
		}
		enrolledSubjects[0].dataValues["totalCredit"] = sum;
		return res.sendJson(200, true, "sucess get subject", enrolledSubjects);
	}),

	/**
	 * @desc      get curriculum
	 * @route     GET /api/v1/syllabus/curriculum/
	 * @access   Private
	 */
	getCurriculum: asyncHandler(async (req, res) => {
		const { major_id, degree } = req.query;
		const student_id = req.student_id;
		let result;
		const key = "getCurriculum-" + student_id;

		const cacheResult = await redisClient.get(key);
		if (cacheResult) {
			result = JSON.parse(cacheResult);
		} else {
			let plain_curriculum = await Promise.all([
				Major.findOne({
					where: {
						id: major_id,
					},
					attributes: [],
					include: {
						model: Subject,
						through: {
							where: { semester: "0", degree: degree },
							attributes: [],
						},
						attributes: [
							"name",
							"id",
							"credit",
							"level",
							"thumbnail_link",
							"lecturer",
							"subject_code",
						],
					},
				}),
				Major.findOne({
					where: {
						id: major_id,
					},
					attributes: [],
					include: {
						model: Subject,
						through: {
							where: { semester: "1", degree: degree },
							attributes: [],
						},
						attributes: [
							"name",
							"id",
							"credit",
							"level",
							"thumbnail_link",
							"lecturer",
						],
					},
				}),
				Major.findOne({
					where: {
						id: major_id,
					},
					attributes: [],
					include: {
						model: Subject,
						through: {
							where: { semester: "2", degree: degree },
							attributes: [],
						},
						attributes: [
							"name",
							"id",
							"credit",
							"level",
							"thumbnail_link",
							"lecturer",
						],
					},
				}),
				Major.findOne({
					where: {
						id: major_id,
					},
					attributes: [],
					include: {
						model: Subject,
						through: {
							where: { semester: "3", degree: degree },
							attributes: [],
						},
						attributes: [
							"name",
							"id",
							"credit",
							"level",
							"thumbnail_link",
							"lecturer",
						],
					},
				}),
				Major.findOne({
					where: {
						id: major_id,
					},
					attributes: [],
					include: {
						model: Subject,
						through: {
							where: { semester: "4", degree: degree },
							attributes: [],
						},
						attributes: [
							"name",
							"id",
							"credit",
							"level",
							"thumbnail_link",
							"lecturer",
						],
					},
				}),
				Major.findOne({
					where: {
						id: major_id,
					},
					attributes: [],
					include: {
						model: Subject,
						through: {
							where: { semester: "5", degree: degree },
							attributes: [],
						},
						attributes: [
							"name",
							"id",
							"credit",
							"level",
							"thumbnail_link",
							"lecturer",
						],
					},
				}),
				Major.findOne({
					where: {
						id: major_id,
					},
					attributes: [],
					include: {
						model: Subject,
						through: {
							where: { semester: "6", degree: degree },
							attributes: [],
						},
						attributes: [
							"name",
							"id",
							"credit",
							"level",
							"thumbnail_link",
							"lecturer",
						],
					},
				}),
				Major.findOne({
					where: {
						id: major_id,
					},
					attributes: [],
					include: {
						model: Subject,
						through: {
							where: { semester: "7", degree: degree },
							attributes: [],
						},
						attributes: [
							"name",
							"id",
							"credit",
							"level",
							"thumbnail_link",
							"lecturer",
						],
					},
				}),
				Major.findOne({
					where: {
						id: major_id,
					},
					attributes: [],
					include: {
						model: Subject,
						through: {
							where: { semester: "8", degree: degree },
							attributes: [],
						},
						attributes: [
							"name",
							"id",
							"credit",
							"level",
							"thumbnail_link",
							"lecturer",
						],
					},
				}),
			]);

			let fin_res = [];

			for (let i = 0; i < plain_curriculum.length; i++) {
				let semdat = [];
				if (plain_curriculum[i] !== null) {
					for (let j = 0; j < plain_curriculum[i].Subjects.length; j++) {
						let teachers = [];
						let { count, rows } = await StudentSubject.findAndCountAll({
							where: {
								subject_id: plain_curriculum[i].Subjects[j].id,
							},
						});

						teachers = await Lecturer.findAll({
							where: {
								id: plain_curriculum[i].Subjects[j].lecturer,
							},
							include: {
								model: User,
								attributes: ["full_name"],
							},
							attributes: [],
						});
						let onedat = {
							subject: plain_curriculum[i].Subjects[j],
							lecturers: teachers,
							student_count: count,
						};
						semdat.push(onedat);
					}
				}
				let onesemdat = {
					semester: i,
					subjects: semdat,
				};
				fin_res.push(onesemdat);
			}

			let maj = await Major.findOne({
				where: {
					id: major_id,
				},
				attributes: [
					"id",
					"name",
					"description",
					"updated_at",
					"thumbnail_link",
				],
				include: {
					model: Lecturer,
					attributes: ["id"],
					include: {
						model: User,
						attributes: ["full_name"],
					},
				},
			});
			const students_information = await Student.findOne({
				attributes:[
					'semester'	
				],
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
						through:{
							attributes:[]
						}
					},
					{
						model: Lecturer,
						attributes:['id'],
						include: [
							{
								model: User,
								attributes: ["full_name"],
							},
						],
					},
				],
			});
			result = {
				students_information: students_information,
				major: maj,
				result: fin_res,
			};
			await redisClient.set(key, JSON.stringify(result), {
				EX: 120,
			});

			if (!maj) {
				return res.sendJson(400, false, "Major ID not found", null);
			}
		}
		return res.sendJson(200, true, "Success", result);
	}),
};
