const { Meeting, User, Student, Lecturer } = require("../models");
const asyncHandler = require("express-async-handler");
const Sequelize = require("sequelize");

module.exports = {
	/**
	 * @desc      create new meeting by Assessor for student
	 * @route     POST /api/v1/meeting/create
	 * @access    Private (Assessor)
	 */
	createMeetingByAssessor: asyncHandler(async (req, res) => {
		const {
			student_id,
			meeting_type,
			place,
			subject,
			topic,
			description,
			time,
		} = req.body;
		const user = req.userData;
		const lecturer_id = req.lecturer_id;

		const findStudent = await Student.findOne({
			where: {
				id: student_id,
			},
		});

		if (!findStudent) {
			return res.sendJson(404, "student not found");
		}

		const profileStudent = await User.findOne({
			where: {
				id: findStudent.user_id,
			},
		});

		const data = await Meeting.create({
			student_id,
			meeting_type,
			place,
			subject,
			topic,
			description,
			assessor_id: lecturer_id,
			status: false,
		});

		for (times of time) {
			await Meeting.update(
				{
					time: Sequelize.fn("array_append", Sequelize.col("time"), times),
				},
				{
					where: {
						id: data.id,
					},
				}
			);
		}

		delete data.dataValues.time;
		delete data.dataValues.updated_at;
		delete data.dataValues.created_at;
		delete data.dataValues.deleted_at;

		return res.sendJson(
			201,
			true,
			`success request time by assessor/lecturer : ${user.full_name} for student : ${profileStudent.full_name}`,
			{
				lecturer_name: user.full_name,
				student_name: profileStudent.full_name,
				...data.dataValues,
				time,
			}
		);
	}),

	/**
	 * @desc      get all meeting by student
	 * @route     GET /api/v1/meeting/
	 * @access    Private (student)
	 */
	getAllMeetingByStudent: asyncHandler(async (req, res) => {
		const user = req.userData;
		const student_id = req.student_id;

		const data = await Meeting.findAll({
			where: {
				student_id: student_id,
			},
		});

		if (data.length === 0) {
			return res.sendJson(200, true, "there are no data meeting", null);
		}

		return res.sendJson(
			200,
			true,
			`success get data by student ${user.full_name}`,
			data
		);
	}),

	/**
	 * @desc      show data by id
	 * @route     GET /api/v1/meeting/:id
	 * @access    Private (student)
	 */
	getMeetingById: asyncHandler(async (req, res) => {
		const { id } = req.params;
		const user = req.userData;

		const data = await Meeting.findOne({
			where: {
				id,
			},
		});

		if (!data) {
			return res.sendJson(404, false, "data meeting not found");
		}

		return res.sendJson(200, true, "success get data by id", data);
	}),

	/**
	 * @desc      acc meeting by assessor for stuent, must login by lecturer
	 * @route     PUT /api/v1/meeting/assessor/:id
	 * @access    Private (student)
	 */
	accMeetingByStudent: asyncHandler(async (req, res) => {
		const { id } = req.params;
		const { time } = req.body;
		const user = req.userData;
		const student_id = req.student_id;

		const dataMeeting = await Meeting.findOne({
			where: {
				id,
			},
		});
		if (!dataMeeting) {
			return res.sendJson(404, false, "data meeting not found");
		}
		const student = await User.findOne({
			where: {
				id: user.id,
			},
		});
		const getUserIdAssessor = await Lecturer.findOne({
			where: {
				id: dataMeeting.assessor_id,
			},
		});
		const assessorName = await User.findOne({
			where: {
				id: getUserIdAssessor.user_id,
			},
		});

		if (dataMeeting.dataValues.student_id != student_id) {
			return res.sendJson(
				403,
				false,
				`sorry ${student.full_name} you're not student for meeting with lecturer ${assessorName.full_name}`,
				null
			);
		}

		const timeToDate = new Date(time);
		const timeToEpoch = timeToDate.getTime();

		const times = dataMeeting.dataValues.time;

		const convertToEpochTimes = times.map((item) => {
			const convert = new Date(item);
			return convert.getTime();
		});

		const filterDate = convertToEpochTimes.filter((item) => {
			if (item == timeToEpoch) {
				return item;
			}
		});

		if (filterDate.length === 0) {
			return res.sendJson(
				403,
				false,
				`sorry student ${student.full_name} please pick your request time meeting with lecturer ${assessorName.full_name}`
			);
		}

		const data = await Meeting.update(
			{
				status: true,
				pick_time: time,
			},
			{
				where: {
					id,
				},
			}
		);

		return res.sendJson(
			200,
			true,
			`success pick time meeting by Lecturer ${assessorName.full_name} with student ${student.full_name}, lecturer will craeate zoom/google meeting`,
			{
				lecturer_name: assessorName.full_name,
				student_name: student.full_name,
				time,
				result: data == 1 ? "acc | TRUE" : "reject | FALSE",
			}
		);
	}),
};
