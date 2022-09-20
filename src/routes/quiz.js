const express = require("express");
const route = express.Router();

const quizController = require("../controllers/quizController");
const { protection } = require("../middlewares/Authentication");

route.post("/create", protection, quizController.createQuiz);

route.get("/desc/:quizId", protection, quizController.getQuizDesc);

route.put("/edit/:quizId", protection, quizController.updateQuiz);

route.delete("/delete/:quizId", protection, quizController.removeQuiz);

route.post("/take/:quizId", protection, quizController.takeQuiz);
route.post("/submit", protection, quizController.postQuizAnswer);

module.exports = route;
