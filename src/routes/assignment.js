const express = require("express");
const route = express.Router();
const multer = require("multer");

const assignmentController = require("../controllers/assignmentController");
const { protection } = require("../middlewares/Authentication");

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 2000000 },
	fileFilter: (req, file, cb) => {
		if (
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
					"Sorry, this upload only support file with type .pdf, .doc and .docx",
					400
				)
			);
		}
	},
});

route.post(
	"/create",
	protection,
	upload.single("file_assignment"),
	assignmentController.createAssignment
);

route.get("/", protection, assignmentController.getAllAssignment);
route.get(
	"/session/:session_id",
	protection,
	assignmentController.getAssignmentInSession
);
route.get("/:assignment_id", protection, assignmentController.getAssignment);

route.put(
	"/edit/:assignment_id",
	protection,
	upload.single("file_assignment"),
	assignmentController.updateAssignment
);
route.delete(
	"/delete/:assignment_id",
	protection,
	assignmentController.removeAssignment
);

module.exports = route;
