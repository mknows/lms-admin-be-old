const express = require("express");
const route = express.Router();

const { protection, authorize } = require("../middlewares/Authentication");
const analyticsController = require("../controllers/analyticsController");

route.get(
	"/semester",
	protection,
	authorize("student"),
	analyticsController.getStudentSemestrialAnalytics
);

module.exports = route;
