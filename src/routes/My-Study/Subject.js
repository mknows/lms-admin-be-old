const express = require("express");
const route = express.Router();

const subjectController = require("../../controllers/My-Study/Admin/SubjectController");
// const { validate, validatorMessage } = require("../middlewares/Validator");
// const { protection } = require("../middlewares/Authentication");

// route.post("/login", validate("loginUser"), validatorMessage, subjectController.insertStudy  );
route.post("/create", subjectController.insertSubject);
route.put("/update/:subjectId", subjectController.editSubject);

module.exports = route;