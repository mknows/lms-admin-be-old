const express = require("express");
const route = express.Router();

const subjectController = require("../controllers/subjectController");
const { protection } = require("../middlewares/Authentication");

route.get("/", protection, subjectController.getAllSubject);
route.post("/create", protection, subjectController.postSubject);
route.put("/edit/:subjectId", protection, subjectController.editSubject);
route.delete("/delete/:subjectId", protection, subjectController.removeSubject);

route.get("/forstudent", protection, subjectController.getSubjectForStudent);
route.post("/enroll", protection, subjectController.takeSubject);

route.get("/forstudent", protection, subjectController.getSubjectForStudent);

module.exports = route;
