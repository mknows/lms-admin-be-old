const express = require("express");
const route = express.Router();

const quizController = require("../controllers/quizController");
const { protection } = require("../middlewares/Authentication");

route.post("/create", protection, quizController.createQuiz);

route.get("/desc", protection, quizController.getQuizDesc);

route.put("/edit/:quiziD", protection, quizController.updateQuiz);

route.delete("/delete/:quizId", protection, quizController.removeQuiz);

route.post("/take/:id", protection, quizController.takeQuiz);
route.post("/submit", protection, quizController.postQuizAnswer);

module.exports = route;
