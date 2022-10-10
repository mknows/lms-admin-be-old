const express = require("express");
const route = express.Router();

const quizController = require("../controllers/quizController");
const { protection, authorize } = require("../middlewares/Authentication");

route.post("/create", protection, quizController.createQuiz);
route.get(
	"/desc/session/:session_id",
	protection,
	authorize("student"),
	quizController.getQuizDescBySession
);

route.get(
	"/desc/:quiz_id",
	protection,
	authorize("student"),
	quizController.getQuizDesc
);

route.put("/edit/:quiz_id", protection, quizController.updateQuiz);

route.delete("/delete/:quiz_id", protection, quizController.removeQuiz);

route.post(
	"/take/:quiz_id",
	protection,
	authorize("student"),
	quizController.takeQuiz
);
route.post(
	"/submit",
	protection,
	authorize("student"),
	quizController.postQuizAnswer
);

route.get(
	"/review/:quiz_id",
	protection,
	authorize("student"),
	quizController.getQuizReview
);

module.exports = route;
