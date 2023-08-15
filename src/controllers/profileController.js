const {
	User,
	Student,
	Subject,
	Certificate,
	StudentSubject,
	MaterialEnrolled,
	Session,
	Assignment,
	DiscussionForum,
	Comment,
	Reply,
} = require("../models");
const moment = require("moment");
const { getAuth: getClientAuth, updateProfile } = require("firebase/auth");
const Sequelize = require("sequelize");
require("dotenv").config();
const { FINISHED, ONGOING, PENDING } = process.env;
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("express-async-handler");
const {
	getStorage,
	ref,
	getDownloadURL,
	deleteObject,
} = require("firebase/storage");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const scoringFunctions = require("../functions/scoringFunctions");

module.exports = {
	/**
	 * @desc      Get User Login Data (Profile)
	 * @route     GET /api/v1/profile/me
	 * @access    Private
	 */
	getMe: asyncHandler(async (req, res) => {
		let token = req.firebaseToken;
		let user = req.userData;

		const data = await User.findOne({
			where: {
				firebase_uid: user.firebase_uid,
			},
			attributes: {
				exclude: ["id", "firebase_uid", "password", "deleted_at", "updated_at"],
			},
		});

		let student_id = "NOT_A_STUDENT";

		if (req.role === "student") {
			student_id = req.student_id;
		}

		return res.status(200).json({
			success: true,
			message: "Account connected.",
			data: { ...data.dataValues, role: req.role, student_id: student_id },
		});
	}),

	/**
	 * @desc      Get student Report
	 * @route     GET /api/v1/profile/dashboard
	 * @access    Private
	 */
	getDashboard: asyncHandler(async (req, res) => {
		const student_id = req.student_id;

		let data = await StudentSubject.findAll({
			where: {
				student_id: student_id,
			},
		});

		return res.sendJson(200, true, "GET_DASHBOARD_SUCCESS", data);
	}),

	/**
	 * @desc      Get User's Achievements
	 * @route     GET /api/v1/profile/achievement
	 * @access    Private
	 */
	achievements: asyncHandler(async (req, res) => {
		let student_id = req.student_id;
		let user_id = req.userData.id;
		let finished_subjects = 0;
		let subjects_taken = 0;

		if (!student_id) {
			return res.sendJson(400, false, "USER_IS_NOT_A_STUDENT", {});
		}

		const subjects = await Student.findOne({
			attributes: ["id"],
			where: {
				id: student_id,
			},
			include: {
				model: Subject,
				attributes: ["id"],
				through: {
					attributes: ["status"],
					where: {
						status: {
							[Sequelize.Op.or]: ["FINISHED", "ONGOING"],
						},
					},
				},
			},
		});
		for (i = 0; i < subjects.Subjects.length; i++) {
			if (subjects.Subjects[i].StudentSubject.status == "FINISHED") {
				finished_subjects++;
			}
			if (subjects.Subjects[i].StudentSubject.status == "ONGOING") {
				subjects_taken++;
			}
			subjects.Subjects[i].dataValues.progress =
				await scoringFunctions.getSubjectProgress(
					subjects.Subjects[i].id,
					req.student_id
				);
		}
		const students_certificate = await Certificate.findAll({
			where: {
				student_id,
			},
		});

		const agenda = await Promise.all([
			await StudentSubject.findAll({
				attributes: ["subject_id"],
				where: {
					student_id: student_id,
					status: PENDING,
				},
				include: {
					model: Subject,
					attributes: ["name", "credit", "subject_code"],
				},
				order: ["created_at"],
			}),
			await MaterialEnrolled.findOne({
				where: {
					student_id,
				},
				attributes: ["updated_at"],
				include: {
					model: Subject,
					attributes: ["name"],
				},
				order: [["updated_at"]],
			}),
			await Certificate.findOne({
				attributes: ["created_at", "file", "link"],
				where: {
					student_id,
				},
				include: {
					model: Subject,
					as: "subject",
					attributes: ["name", "credit"],
				},
				order: [["created_at", "DESC"]],
			}),
			await MaterialEnrolled.findAll({
				attributes: ["created_at"],
				where: {
					student_id,
					type: "ASSIGNMENT",
					status: "ONGOING",
				},
				include: [
					{
						model: Subject,
						attributes: ["name"],
					},
					{
						model: Session,
						attributes: ["session_no"],
					},
					{
						model: Assignment,
						attributes: ["duration"],
					},
				],
			}),

			await Student.findOne({
				where: {
					id: student_id,
				},
				include: {
					model: Session,
					include: [
						{
							model: DiscussionForum,
							include: [
								{
									model: Comment,
									where: {
										author_id: user_id,
									},
									required: false,
								},
								{
									model: Reply,
									where: {
										author_id: user_id,
									},
									required: false,
								},
							],
						},
						{
							model: Subject,
							attributes: ["name"],
						},
					],
				},
			}),
		]);
		let uncommented_sessions = [];
		agenda[4].Sessions.forEach((session) => {
			session.DiscussionForums.forEach((df) => {
				if (df.Comments.length === 0 && df.Replies.length === 0) {
					uncommented_sessions.push({
						session_no: session.session_no,
						subject: session.Subject.name,
						df_id: df.id,
					});
				}
			});
		});
		let undone_assignment = [];
		for (let i = 0; i < agenda[3].length; i++) {
			const deadline = new Date(
				new Date(agenda[3][i].created_at).getTime() +
					agenda[3][i].Assignment.duration * 1000
			);
			agenda[3][i].deadline = moment(deadline).format("DD/MM/YYYY hh:mm:ss");
			undone_assignment.push({
				deadline: moment(deadline).format("DD/MM/YYYY hh:mm:ss"),
				assignment_info: agenda[3][i],
			});
		}
		return res.sendJson(200, true, "SUCCESS_GET_ACHIEVMENT", {
			finished_subjects: finished_subjects,
			subject_taken: subjects_taken,
			students_certificate: students_certificate.length,
			subjects_enrolled: subjects,
			plans_not_accepted: agenda[0],
			least_opened_subject: agenda[1],
			newest_cert: agenda[2],
			undone_assignment: undone_assignment,
			discussion_uncommented: uncommented_sessions,
		});
	}),

	/**
	 * @desc      Update User Login Data (Profile)
	 * @route     PUT /api/v1/profile/me
	 * @access    Private
	 */
	updateMe: asyncHandler(async (req, res) => {
		let token = req.firebaseToken;
		let user = req.userData;
		const storage = getStorage();

		let { full_name, gender, phone, address } = req.body;

		let curr_user = await User.findOne({
			where: {
				id: user.id,
			},
		});

		full_name = full_name ? full_name : curr_user.full_name;
		gender = gender ? gender : curr_user.gender;
		phone = phone ? phone : curr_user.phone;
		address = address ? address : curr_user.address;

		let data = await User.update(
			{
				full_name: titleCase(full_name),
				gender,
				phone,
				address,
			},
			{
				where: {
					id: user.id,
				},
				returning: true,
				plain: true,
			}
		);

		delete data[1].dataValues["id"];
		delete data[1].dataValues["firebase_uid"];
		delete data[1].dataValues["password"];

		await updateProfile(getClientAuth(), {
			full_name: titleCase(full_name),
		});

		let student_id = "NOT_A_STUDENT";

		if (req.role === "student") {
			student_id = req.student_id;
		}

		if (req.file) {
			const getFile = await User.findOne({
				where: {
					id: user.id,
				},
			});

			if (getFile.display_picture) {
				deleteObject(ref(storage, getFile.display_picture));
			}

			const bucket = admin.storage().bucket();
			const displayPictureFile =
				"images/profile/" +
				uuidv4() +
				"-" +
				req.file.originalname.split(" ").join("-");
			const displayPictureBuffer = req.file.buffer;

			bucket
				.file(displayPictureFile)
				.createWriteStream()
				.end(displayPictureBuffer)
				.on("finish", () => {
					getDownloadURL(ref(storage, displayPictureFile)).then(
						async (linkFile) => {
							await User.update(
								{
									display_picture_link: linkFile,
									display_picture: displayPictureFile,
								},
								{
									where: {
										id: user.id,
									},
									returning: true,
									plain: true,
								}
							);
							delete data[1].dataValues["display_picture_link"];

							return await res.sendJson(200, true, "success update data user", {
								...data[1].dataValues,
								role: req.role,
								student_id: student_id,
								display_picture_link: linkFile,
							});
						}
					);
				});
		}

		return res.sendJson(200, true, "SUCCESS_UPDATE_USER", {
			...data[1].dataValues,
			role: req.role,
			student_id: student_id,
		});
	}),
};

// Usage for Capitalize Each Word
function titleCase(str) {
	var splitStr = str.toLowerCase().split(" ");
	for (var i = 0; i < splitStr.length; i++) {
		splitStr[i] =
			splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}

	return splitStr.join(" ");
}

// Usage for Phone Number Validator (Firebase) (Example: +62 822 xxxx xxxx)
function phoneNumber(number) {
	var validationPhone = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
	if (number.value.match(validationPhone)) {
		return true;
	} else {
		return false;
	}
}

const sleep = (ms) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};
