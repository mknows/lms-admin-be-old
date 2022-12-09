const express = require("express");
const route = express.Router();

const { protection, authorize } = require("../middlewares/Authentication");
const meetingController = require("../controllers/meetingController");

route.post(
	"/create",
	protection,
	authorize("student"),
	meetingController.createMeeting
);

module.exports = route;
