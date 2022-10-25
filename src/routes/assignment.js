const express = require("express");
const route = express.Router();
const multer = require("multer");

const assignmentController = require("../controllers/assignmentController");
const {
	protection,
	authorize,
	existence,
	enrolled,
	moduleTaken,
} = require("../middlewares/Authentication");

const { Session } = require("../models");

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 2000000 },
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == "application/pdf" ||
			file.mimetype == "application/msword" ||
			file.mimetype ==
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg"
		) {
			return cb(null, true);
		} else {
			cb(null, true);
			return cb(
				new Error(
					"Sorry, this upload only support file with type .pdf, .doc and .docx",
					400
				)
			);
		}
	},
});

route.post(
	"/submit/:session_id",
	protection,
	authorize("student", "user"),
	upload.single("file_assignment"),
	existence(Session),
	assignmentController.submitAssignment
);
route.put(
	"/edit/:session_id",
	protection,
	authorize("student", "user"),
	upload.single("file_assignment"),
	assignmentController.updateAssignment
);

route.get("/", protection, assignmentController.getAllAssignment);
route.get(
	"/session/:session_id",
	protection,
	authorize("student", "user"),
	assignmentController.getAssignmentInSession
);
route.get("/:assignment_id", protection, assignmentController.getAssignment);

// route.put(
// 	"/edit/:assignment_id",
// 	protection,
// 	upload.single("file_assignment"),
// 	assignmentController.updateAssignment
// );
route.delete(
	"/delete/:session_id",
	protection,
	authorize("user", "student"),
	assignmentController.removeSubmission
);

module.exports = route;
