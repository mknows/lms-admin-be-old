const express = require("express");
const route = express.Router();

const quizController = require("../controllers/quizController");
const { protection } = require("../middlewares/Authentication");

route.get("/desc", protection, quizController.getQuizDesc);

route.post("/create", protection, quizController.makeQuiz);
route.post("/take/:id", protection, quizController.takeQuiz);
route.post("/submit", protection, quizController.postQuizAnswer);

module.exports = route;