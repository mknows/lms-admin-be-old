const express = require("express");
const route = express.Router();
const multer = require("multer");

const subjectController = require("../controllers/subjectController");
const { protection } = require("../middlewares/Authentication");

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 2000000 },
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg"
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

route.post(
	"/create",
	protection,
	upload.single("thumbnail"),
	subjectController.createSubject
);
route.post("/enroll", protection, subjectController.takeSubject);

route.get("/forstudent", protection, subjectController.getSubjectForStudent);
route.get(
	"/enrolledsubjects",
	protection,
	subjectController.getEnrolledSubject
);
route.get("/studyplan", protection, subjectController.getStudyPlan);
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

module.exports = route;
