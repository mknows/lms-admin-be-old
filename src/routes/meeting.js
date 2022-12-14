const express = require("express");
const route = express.Router();

const { protection, authorize } = require("../middlewares/Authentication");
const meetingController = require("../controllers/meetingController");
const { validate, validatorMessage } = require("../middlewares/Validator");

route.post(
	"/create",
	protection,
	authorize("lecturer"),
	validate("createMeetingByAssessor"),
	validatorMessage,
	meetingController.createMeetingByAssessor
);

route.get(
	"/",
	protection,
	authorize("student"),
	meetingController.getAllMeetingByStudent
);

route.put(
	"/assessor/:id",
	protection,
	authorize("student"),
	validate("accMeetingByStudent"),
	validatorMessage,
	meetingController.accMeetingByStudent
);

module.exports = route;
