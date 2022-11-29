const asyncHandler = require("express-async-handler");

const {
	Student,
	StudentSubject,
	Subject,
	User,
	Major,
	MaterialEnrolled,
	Session,
} = require("../models");

module.exports = {
	testAPI: asyncHandler(async (req, res) => {
		const { nama } = req.body;

		let student_id = "cd11d046-43b4-11ed-b878-0242ac120002";

		let data1 = await StudentSubject.findAll({
			where: {
				status: "FINISHED",
			},
			attributes: {
				include: ["created_at"],
				exclude: ["final_score"],
			},
		});

		let data2 = await Student.findOne({
			where: {
				id: student_id,
			},
			include: [
				{
					model: User,
					attributes: ["full_name"],
				},
				{
					model: Subject,
					where: {
						name: "Introduction to Economics I",
					},
					attributes: {
						exclude: ["StudentSubject"],
					},
					include: {
						model: Major,
					},
				},
			],
		});

		let result = {
			data2,
		};

		return res.sendJson(200, true, "berhasil", result);
	}),
	materialEnrolled: asyncHandler(async (req, res) => {
		const material_enrolled = await MaterialEnrolled.findOne({
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
					model: Student,
					attributes: ["user_id"],
					include: {
						model: User,
						attributes: ["full_name"],
					},
				},
			],
		});
		let data = {
			student_id: material_enrolled.student_id,
			student_name: material_enrolled.Student.User.full_name,
			subject_name: material_enrolled.Subject.name,
			session_no: material_enrolled.Session.session_no,
		};
		return res.sendJson(200, true, "berhasil", data);
	}),

	ping: asyncHandler(async (req, res) => {
		return res.sendJson(200, true, "YALL PINGED?", data);
	}),
};
