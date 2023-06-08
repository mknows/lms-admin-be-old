const express = require("express");
const route = express.Router();
const multer = require("multer");

const subjectController = require("../controllers/subjectController");
const {
	protection,
	authorize,
	enrolled,
	existence,
} = require("../middlewares/Authentication");

const { Subject, StudentSubject, Major } = require("../models");

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 2000000 },
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg" ||
			file.mimetype == "application/pdf" ||
			file.mimetype == "application/msword" ||
			file.mimetype ==
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		) {
			return cb(null, true);
		} else {
			cb(null, true);
			return cb(
				new Error(
					"Sorry, this upload only support file with type .png, .jpg and .jpeg",
					400
				)
			);
		}
	},
});
route.get("/seed", protection, subjectController.seed);

route.post(
	"/create",
	protection,
	upload.single("thumbnail"),
	subjectController.createSubject
);

route.post("/create", protection, subjectController.createSubject);
route.post(
	"/enroll/:subject_id",
	protection,
	authorize("student"),
	existence(Subject),
	enrolled(Major),
	subjectController.takeSubject
);
route.post(
	"/uploadkhs/:subject_id",
	protection,
	authorize("student"),
	existence(Subject),
	enrolled(Major),
	upload.single("proof"),
	subjectController.existKhsUpload
);

route.get("/forstudent", protection, subjectController.getSubjectForStudent);
route.get(
	"/enrolledsubjects",
	protection,
	authorize("student"),
	subjectController.getEnrolledSubject
);
route.get(
	"/studyplan",
	protection,
	authorize("student"),
	subjectController.getStudyPlan
);
route.get("/:subject_id", protection, subjectController.getSubject);
route.get("/", protection, subjectController.getAllSubject);

route.put(
	"/edit/:subject_id",
	protection,
	upload.single("thumbnail"),
	subjectController.editSubject
);

route.delete(
	"/delete/:subject_id",
	protection,
	subjectController.removeSubject
);

route.delete(
	"/deletedraft/:subject_id",
	protection,
	authorize("student"),
	existence(StudentSubject),
	enrolled(Subject),
	subjectController.deleteDraft
);
route.put(
	"/senddraft",
	protection,
	authorize("student"),
	subjectController.sendDraft
);

module.exports = route;