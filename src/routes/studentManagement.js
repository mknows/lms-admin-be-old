const express = require("express");
const route = express.Router();

const studentManagementController = require("../controllers/studentManagementController");

route.put("/grade/assignment", studentManagementController.gradeAssignment);
route.put(
	"/studyplan/accept",
	studentManagementController.acceptStudentStudyPlan
);

route.post("/makeuser/student", studentManagementController.makeUserToStudent);

route.get(
	"/getpendingstudentplans",
	studentManagementController.getPendingStudyPlan
);

module.exports = route;
