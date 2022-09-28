const express = require("express");
const route = express.Router();

const subjectController = require("../controllers/subjectController");
const { protection } = require("../middlewares/Authentication");

route.post("/create", protection, subjectController.createSubject);

route.get("/", protection, subjectController.getAllSubject);
route.get("/forstudent", protection, subjectController.getSubjectForStudent);
route.get(
	"/enrolledsubjects",
	protection,
	subjectController.getEnrolledSubject
);

route.post("/enroll", protection, subjectController.takeSubject);

route.get("/:subject_id", protection, subjectController.getSubject);
route.put("/edit/:subject_id", protection, subjectController.editSubject);

route.delete(
	"/delete/:subject_id",
	protection,
	subjectController.removeSubject
);

module.exports = route;
