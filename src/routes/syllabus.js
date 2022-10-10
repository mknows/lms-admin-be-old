const express = require("express");
const route = express.Router();

const syllabusController = require("../controllers/syllabusController");
const { protection, authorize } = require("../middlewares/Authentication");

route.get("/majors/all", protection, syllabusController.getAllMajors);
route.get(
	"/majors/paginate",
	protection,
	syllabusController.getAllMajorsPagination
);
route.get("/curriculum", protection, authorize("student","user"), syllabusController.getCurriculum);
route.get("/subjects/all", protection, syllabusController.getAllSubjects);
route.get(
	"/subjects/paginate",
	protection,
	syllabusController.getAllSubjectsPagination
);
route.get(
	"/subjectByMajor/:major_id",
	protection,
	syllabusController.subjectByMajor
);
route.get(
	"/subject/:subject_id",
	protection,
	syllabusController.getSubject
);
route.get(
	"/getCurrentKRS",
	protection,
	syllabusController.getKRS
);

module.exports = route;
