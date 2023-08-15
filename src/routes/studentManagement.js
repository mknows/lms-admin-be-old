const express = require("express");
const route = express.Router();

const studentManagementController = require("../controllers/studentManagementController");
const { protection, authorizeAdmin } = require("../middlewares/Authentication");

route.put("/grade/assignment", studentManagementController.gradeAssignment);
route.put(
	"/studyplan/accept",
	protection,
	authorizeAdmin,
	studentManagementController.acceptStudentStudyPlan
);

route.post(
	"/makeuser/student",
	protection,
	authorizeAdmin,
	studentManagementController.makeUserToStudent
);

route.get(
	"/studentsubjects",
	protection,
	authorizeAdmin,
	studentManagementController.getStudyPlan
);

module.exports = route;
