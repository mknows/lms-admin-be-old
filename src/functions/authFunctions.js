const { User, Student, Lecturer, Admin } = require("../models");
const { Op, fn, col } = require("sequelize");

exports.getUserRole = async (user_id) => {
	let result = [];

	const is_student = await Student.findOne({
		where: {
			user_id: user_id,
		},
	});

	if (is_student != null) {
		result.push("STUDENT");
	}

	const is_lecturer = await Lecturer.findOne({
		where: {
			user_id: user_id,
		},
	});

	if (is_lecturer != null) {
		result.push("LECTURER");
	}

	return result;
};
