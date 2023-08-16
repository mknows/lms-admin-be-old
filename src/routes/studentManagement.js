const express = require("express");
const route = express.Router();

const studentManagementController = require("../controllers/studentManagementController");
const { protection, authorizeAdmin } = require("../middlewares/Authentication");

route.put(
	"/studyplan/accept",
	protection,
	authorizeAdmin,
	studentManagementController.acceptStudentStudyPlan
);

route.get(
	"/studyplan/get",
	protection,
	authorizeAdmin,
	studentManagementController.getStudyPlan
);

route.post(
	"/student/create",
	protection,
	authorizeAdmin,
	studentManagementController.createStudent
);

route.get(
	"/student/all",
	protection,
	authorizeAdmin,
	studentManagementController.createStudent
);

route.put(
	"/grade/assignment",
	protection,
	authorizeAdmin,
	studentManagementController.gradeAssignment
);

module.exports = route;
