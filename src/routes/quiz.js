const express = require("express");
const route = express.Router();

const quizController = require("../controllers/quizController");
const { protection } = require("../middlewares/Authentication");

route.post("/create", protection, quizController.createQuiz);
route.get(
	"/desc/session/:session_id",
	protection,
	quizController.getQuizDescBySession
);

route.get("/desc/:quiz_id", protection, quizController.getQuizDesc);

route.put("/edit/:quiz_id", protection, quizController.updateQuiz);

route.delete("/delete/:quiz_id", protection, quizController.removeQuiz);

route.post("/take/:quiz_id", protection, quizController.takeQuiz);
route.post("/submit", protection, quizController.postQuizAnswer);

module.exports = route;
