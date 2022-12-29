const express = require("express");
const route = express.Router();

const studentStatisticController = require("../controllers/studentStatisticController");
const { protection, authorize } = require("../middlewares/Authentication");

route.get(
	"/subject",
	protection,
	authorize("user", "student"),
	studentStatisticController.getSubjectReport
);
route.get(
	"/likescore",
	protection,
	authorize("user", "student"),
	studentStatisticController.getScoreReport
);

route.get(
	"/semestrial",
	protection,
	authorize("user", "student"),
	studentStatisticController.getSemestrialReport
);

module.exports = route;
