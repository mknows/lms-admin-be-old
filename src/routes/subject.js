const express = require("express");
const route = express.Router();

const subjectController = require("../controllers/subjectController");
const { protection } = require("../middlewares/Authentication");

route.post("/create", protection, subjectController.createSubject);
route.post("/enroll", protection, subjectController.takeSubject);

route.get("/forstudent", protection, subjectController.getSubjectForStudent);
route.get(
	"/enrolledsubjects",
	protection,
	subjectController.getEnrolledSubject
);
route.get("/studyplan", protection, subjectController.getStudyPlan);
route.get("/:subject_id", protection, subjectController.getSubject);
route.get("/", protection, subjectController.getAllSubject);

route.put("/edit/:subject_id", protection, subjectController.editSubject);

route.delete(
	"/delete/:subject_id",
	protection,
	subjectController.removeSubject
);

module.exports = route;
