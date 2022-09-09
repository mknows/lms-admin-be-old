const express = require("express");
const route = express.Router();

const quizController = require("../../controllers/My-Study/Admin/QuizController");
// const { validate, validatorMessage } = require("../middlewares/Validator");
// const { protection } = require("../middlewares/Authentication");

// route.post("/login", validate("loginUser"), validatorMessage, quizController.insertStudy  );
route.post("/create-quiz/:quizId/:meetId", quizController.createQuiz);
route.put("/edit-quiz/:quizId/:meetId", quizController.editQuiz);

module.exports = route;