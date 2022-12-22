const express = require("express");
const route = express.Router();

const { protection, authorize } = require("../middlewares/Authentication");
const assessmentController = require("../controllers/assessmentController");
const { validate, validatorMessage } = require("../middlewares/Validator");

route.post(
	"/create",
	protection,
	authorize("lecturer"),
	validate("createMeetingByAssessor"),
	validatorMessage,
	assessmentController.createMeetingByAssessor
);

route.get(
	"/",
	protection,
	authorize("student"),
	assessmentController.getAllMeetingByStudent
);

route.get(
	"/:id",
	protection,
	authorize("student"),
	assessmentController.getMeetingById
);

route.put(
	"/pick/:id",
	protection,
	authorize("student"),
	validate("accMeetingByStudent"),
	validatorMessage,
	assessmentController.accMeetingByStudent
);

module.exports = route;
