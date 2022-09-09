const express = require("express");
const route = express.Router();

const subjectController = require("../controllers/subjectController");
const { protection } = require("../middlewares/Authentication");

route.post("/create", protection, subjectController.postSubject);
route.post("/enroll", protection, subjectController.takeSubject);

route.get("/getall", protection, studikuController.getAllSubject);
route.get("/forstudent", protection, studikuController.getSubjectForStudent);

module.exports = route;