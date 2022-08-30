const express = require("express");
const route = express.Router();

const studikuController = require("../controllers/studikuController");
const { protection } = require("../middlewares/Authentication");

route.get("/allsubject", studikuController.getAllStudentSubject);
route.get("/studentsSubject", protection, studikuController.getStudentsSubject);

module.exports = route;
