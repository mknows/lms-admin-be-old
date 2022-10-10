const express = require("express");
const route = express.Router();

const quizController = require("../controllers/quizController");
<<<<<<< HEAD
const { protection,authorize } = require("../middlewares/Authentication");
=======
const { protection, authorize } = require("../middlewares/Authentication");
>>>>>>> 376d80d (try quiz hist)

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

<<<<<<< HEAD
route.post("/take/:session_id", protection, authorize("user","student") ,quizController.takeQuiz);
route.post("/submit", protection, quizController.postQuizAnswer);
=======
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
>>>>>>> 376d80d (try quiz hist)

module.exports = route;
