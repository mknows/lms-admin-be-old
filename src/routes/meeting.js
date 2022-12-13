const express = require("express");
const route = express.Router();

const { protection, authorize } = require("../middlewares/Authentication");
const meetingController = require("../controllers/meetingController");
const { validate, validatorMessage } = require("../middlewares/Validator");

route.post(
	"/create",
	protection,
	authorize("student"),
	validate("createMeetingStudent"),
	validatorMessage,
	meetingController.createMeeting
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
	authorize("lecturer"),
	validate("accMeetingByAssessor"),
	validatorMessage,
	meetingController.accMeetingByAssessor
);

module.exports = route;
