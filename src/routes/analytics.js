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

route.get("/predict", protection, analyticsController.getStudentPrediction);

module.exports = route;
