const express = require("express");
const route = express.Router();

const studikuController = require("../controllers/studikuController");
const { protection } = require("../middlewares/Authentication");

route.get("/allsubject", studikuController.getAllSubject);
route.get("/getModule/:id", protection, studikuController.getModule)
route.get("/getQuizzDesc/:id", protection, studikuController.getQuizDesc)
route.post("/makeQuiz", protection, studikuController.makeQuiz)
route.post("/takeQuiz/:id", protection, studikuController.takeQuiz)
route.post("/postQuizAnswer", protection, studikuController.postQuizAnswer)
route.post("/takeSubject", protection, studikuController.takeSubject)
route.get("/getSubjectForStudent", protection, studikuController.getSubjectForStudent)


module.exports = route;
