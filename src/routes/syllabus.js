const express = require("express");
const route = express.Router();

const syllabusController = require("../controllers/syllabusController");
const { protection } = require("../middlewares/Authentication");

route.get("/getAllMajors", protection, syllabusController.getAllMajors);
route.get(
	"/getAllMajorsPagination",
	protection,
	syllabusController.getAllMajorsPagination
);
route.get("/getAllSubjects", protection, syllabusController.getAllSubjects);
route.get(
	"/getAllSubjectsPagination",
	protection,
	syllabusController.getAllSubjectsPagination
);

module.exports = route;
