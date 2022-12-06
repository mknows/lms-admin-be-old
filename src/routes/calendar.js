const express = require("express");
const route = express.Router();

const calendarController = require("../controllers/calendarController");
const { protection, authorize } = require("../middlewares/Authentication");
const { validate, validatorMessage } = require("../middlewares/Validator");

route.get(
	"/all",
	protection,
	authorize("student"),
	calendarController.getAllSchedule
);

module.exports = route;
