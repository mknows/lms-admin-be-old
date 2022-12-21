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
	let result = 0;
	result = getRandomInt(3);
	return result;
};

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
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
