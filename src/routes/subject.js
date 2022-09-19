const express = require("express");
const route = express.Router();

const subjectController = require("../controllers/subjectController");
const { protection } = require("../middlewares/Authentication");

route.post("/create", protection, subjectController.createSubject);

route.get("/", protection, subjectController.getAllSubject);
route.get("/forstudent", protection, subjectController.getSubjectForStudent);
route.delete("/:subjectId", protection, subjectController.getSubject);

route.put("/edit/:subjectId", protection, subjectController.editSubject);

route.delete("/delete/:subjectId", protection, subjectController.removeSubject);

route.post("/enroll", protection, subjectController.takeSubject);
route.get("/forstudent", protection, subjectController.getSubjectForStudent);

module.exports = route;
