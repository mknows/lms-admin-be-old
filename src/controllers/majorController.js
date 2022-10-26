const { Major, Subject, MajorSubject, StudentMajor } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const {
	getStorage,
	ref,
	getDownloadURL,
	deleteObject,
} = require("firebase/storage");
const student = require("../models/student");
const { redisClient } = require("../helpers/redis");

module.exports = {
	/**
	 * @desc      post Major (Tambah Major)
	 * @route     POST /api/v1/major/create
	 * @access    Private
	 */
	postMajor: asyncHandler(async (req, res) => {
		const { major } = req.body;
		const storage = getStorage();
		const bucket = admin.storage().bucket();
		if (!major) return res.sendJson(400, false, "Some fields is missing.", {});

		const thumbnailFile =
			"images/thumbnail_major/" +
			uuidv4() +
			"-" +
			req.file.originalname.split(" ").join("-");
		const thumbnailBuffer = req.file.buffer;

		let data = await Major.create({
			name: major[0].toUpperCase() + major.slice(1),
		});

		bucket
			.file(thumbnailFile)
			.createWriteStream()
			.end(thumbnailBuffer)
			.on("finish", () => {
				getDownloadURL(ref(storage, thumbnailFile)).then(async (fileLink) => {
					await Major.update(
						{
							thumbnail: thumbnailFile,
							thumbnail_link: fileLink,
						},
						{
							where: {
								id: data.id,
							},
						}
					);

					return res.sendJson(
						200,
						true,
						"Create New Major Success.",
						data.dataValues
					);
				});
			});
	}),

	/**
	 * @desc      post MajorSubjects
	 * @route     POST /api/v1/major/insertsubjects/:major_id
	 * @access    Private
	 */
	insertSubjectToMajor: asyncHandler(async (req, res) => {
		const { subjects } = req.body;
		const { major_id } = req.params;

		if (!major_id) {
			return res.sendJson(400, false, "Some fields are missing.", {});
		}

		const major = await Major.findOne({
			where: {
				id: major_id,
			},
		});

		if (!major) {
			return res.sendJson(400, false, "Invalid major id", {});
		}

		for (let i = 0; i < subjects.length; i++) {
			let sub = await Subject.findOne({
				where: {
					id: subjects[i],
				},
			});

			if (!sub) {
				return res.sendJson(
					400,
					false,
					`invalid subject id ${subjects[i]}`,
					{}
				);
			}

			await MajorSubject.create({
				major_id: major_id,
				subject_id: subjects[i],
			});
		}

		return res.sendJson(
			200,
			true,
			"Successfully Created New MajorSubjects",
			major
		);
	}),

	/**
	 * @desc      get Major
	 * @route     GET /api/v1/major
	 * @access    Public
	 */
	getAllMajors: asyncHandler(async (req, res) => {
		let result;
		const key = "getAllMajors-" + req.userData.id;
		const cacheResult = await redisClient.get(key);

		if (cacheResult) {
			result = JSON.parse(cacheResult);
		} else {
			const data = await Major.findAll();
			result = data;
			await redisClient.set(key, JSON.stringify(result), {
				EX: 120,
			});
		}
		return res.sendJson(200, true, "Search all major successfully.", result);
	}),

	/**
	 * @desc      get one Major
	 * @route     GET /api/v1/major/:id
	 * @access    Public
	 */
	getMajor: asyncHandler(async (req, res) => {
		const { major_id } = req.params;
		const data = await Major.findOne({
			where: {
				id: major_id,
			},
		});

		const subs = await MajorSubject.findAll({
			where: {
				major_id: major_id,
			},
		});

		const num_of_sub = subs.length;
		return res.sendJson(200, true, "Search major successfully.", {
			...data.dataValues,
			number_of_subjects: num_of_sub,
		});
	}),

	/**
	 * @desc      Edit Major (Ubah Major)
	 * @route     PUT /api/v1/major/edit/:major_id
	 * @access    Private
	 */
	editMajor: asyncHandler(async (req, res) => {
		const { major_id } = req.params;
		const { major } = req.body;
		const storage = getStorage();
		const bucket = admin.storage().bucket();

		let data = await Major.findOne({
			where: { id: major_id },
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid major_id.",
				data: {},
			});
		}

		if (req.file) {
			if (data.thumbnail) {
				deleteObject(ref(storage, data.thumbnail));
			}

			const thumbnailFile =
				"images/thumbnail_major/" +
				uuidv4() +
				"-" +
				req.file.originalname.split(" ").join("-");
			const thumbnailBuffer = req.file.buffer;

			bucket
				.file(thumbnailFile)
				.createWriteStream()
				.end(thumbnailBuffer)
				.on("finish", () => {
					getDownloadURL(ref(storage, thumbnailFile)).then(async (fileLink) => {
						await Major.update(
							{
								thumbnail: thumbnailFile,
								thumbnail_link: fileLink,
							},
							{
								where: {
									id: major_id,
								},
							}
						);
					});
				});
		}

		data = await Major.update(
			{
				name: major,
			},
			{
				where: { id: major_id },
				returning: true,
				plain: true,
			}
		);

		return res.status(200).json({
			success: true,
			message: `Edit Major with ID ${major_id} successfully.`,
		});
	}),

	/**
	 * @desc      Delete Major (Hapus Major)
	 * @route     DELETE /api/v1/majors/delete/:major_id
	 * @access    Private
	 */
	removeMajor: asyncHandler(async (req, res) => {
		const { major_id } = req.params;
		const storage = getStorage();

		let data = await Major.findOne({
			where: { id: major_id },
		});

		if (!data)
			return res.status(404).json({
				success: false,
				message: "Invalid major_id.",
				data: {},
			});

		if (data.thumbnail) {
			deleteObject(ref(storage, data.thumbnail));
		}

		Major.destroy({
			where: { id: major_id },
		});

		return res.status(200).json({
			success: true,
			message: `Delete Major with ID ${major_id} successfully.`,
			data: {},
		});
	}),
	/**
	 * @desc      Delete Major (Hapus Major)
	 * @route     POST /api/v1/majors/take/:major_id
	 * @access    Private
	 */
	enrollMajor: asyncHandler(async (req, res) => {
		const { major_id } = req.params;
		const student_id = req.student_id;

		const students_major = await StudentMajor.findOne({
			where: {
				student_id: student_id,
			},
		});
		if (students_major?.major_id === major_id) {
			return res.status(400).json({
				success: false,
				message: `Student is already enrolled in this major`,
			});
		}
		if (students_major) {
			return res.status(400).json({
				success: false,
				message: `Student is already enrolled to a major`,
			});
		}
		if (!students_major) {
			let stud_maj = await StudentMajor.create({
				student_id: student_id,
				major_id: major_id,
				status: "ONGOING",
			});

			let maj = await Major.findOne({
				where: {
					id: major_id,
				},
			});
			return res.status(200).json({
				success: true,
				message: `Enrolled to ${maj.name}`,
			});
		}
	}),
};
