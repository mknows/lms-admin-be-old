const express = require("express");
const route = express.Router();

const jobController = require("../controllers/jobController");
const { protection, authorize } = require("../middlewares/Authentication");

route.get("/getall", jobController.getAllJobs);
route.post(
	"/apply/:job_id",
	protection,
	authorize("student"),
	jobController.takeJob
);
route.get(
	"/student",
	protection,
	authorize("student"),
	jobController.getAllStudentJob
);

module.exports = route;
