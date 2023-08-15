const express = require("express");
const route = express.Router();
const multer = require("multer");

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
					"Sorry, this upload only support file with type .png, .jpg or .jpeg.",
					400
				)
			);
		}
	},
});

const profileController = require("../controllers/profileController");
const { validate, validatorMessage } = require("../middlewares/Validator");
const { protection, authorize } = require("../middlewares/Authentication");

route.get(
	"/me",
	protection,
	authorize("user", "student"),
	profileController.getMe
);
route.get(
	"/achievements",
	protection,
	authorize("user", "student"),
	profileController.achievements
);
route.get(
	"/dashboard",
	protection,
	authorize("student"),
	profileController.getDashboard
);
route.put(
	"/me",
	protection,
	upload.single("display_picture"),
	authorize("user", "student"),
	validate("updateDataUser"),
	validatorMessage,
	profileController.updateMe
);

module.exports = route;
