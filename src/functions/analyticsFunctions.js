const { StudentDatapool, User, Student } = require("../models");
require("dotenv").config();
const {
	WEIGHT_A,
	WEIGHT_A_MINUS,
	WEIGHT_B_PLUS,
	WEIGHT_B,
	WEIGHT_B_MINUS,
	WEIGHT_C_PLUS,
	WEIGHT_C,
	WEIGHT_C_MINUS,
	WEIGHT_D,
	WEIGHT_E,
} = process.env;
const { Op, fn, col } = require("sequelize");

exports.getPrediction = async (student_id, semester) => {
	let result;

	let student_data = await StudentDatapool.findOne({
		where: {
			student_id: student_id,
			semester: semester,
		},
	});

	let data = {
		semester: semester,
		gpa: student_data.gpa,
		major: student_data.major,

		age: student_data.age,
		gender: student_data.gender,

		quickest_subject: student_data.quickest_subject,
		most_frequent_subject: student_data.most_frequent_subject,
		highest_grade_subject: student_data.highest_grade_subject,

		slowest_subject: student_data.slowest_subject,
		least_frequent_subject: student_data.least_frequent_subject,
		lowest_grade_subject: student_data.lowest_grade_subject,
	};

	const prediction = predict(data);
	result = prediction;
	result = indexed_jobs[prediction];
	return result;
};

// prediction function
function predict(data) {
	let result = prediction_V2(data);
	return result;
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function prediction_V1(data) {
	let limit = Object.keys(indexed_jobs).length - 1;
	return getRandomInt(limit);
}

function prediction_V2(data) {
	let result;

	const positive_ref =
		(0.1 * data.quickest_subject) / 72 +
		(0.6 * data.most_frequent_subject) / 72 +
		(0.3 * data.highest_grade_subject) / 72;

	const negative_ref =
		(0.4 * data.slowest_subject) / 72 +
		(0.2 * data.least_frequent_subject) / 72 +
		(0.4 * data.lowest_grade_subject) / 72;

	const physical_ref = (0.5 * data.age) / 100 + (0.5 * data.gender) / 9;

	const neutral_academic_ref =
		(0.2 * data.semester) / 8 + (0.3 * data.gpa) / 4 + (0.5 * data.major) / 10;

	let res_num =
		0.45 * positive_ref +
		0.45 * negative_ref +
		0.05 * physical_ref +
		0.05 * neutral_academic_ref;

	res_num = Math.ceil(res_num * 10);

	result = res_num;

	return result;
}

const indexed_jobs = {
	0: "Undetermined",
	1: "Unemployed",
	2: "Hedge Fund Manager",
	3: "Bussines Analyst",
	4: "Bussiness Consultant",
	5: "Animator",
	6: "Content Creator",
	7: "Video Editor",
	8: "Database Engineer",
	9: "Front End Engineer",
	10: "Back End Engineer",
};
