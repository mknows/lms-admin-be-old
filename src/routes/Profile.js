const express = require("express");
const route = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const getExtension = (filename) => {
	var i = filename.lastIndexOf(".");
	return i < 0 ? "" : filename.substr(i);
};

const fileStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/images");
	},
	filename: function (req, file, cb) {
		cb(
			null,
			`user_${req.userData.id}_${uuidv4().split("-").join("_")}${getExtension(
				file.originalname
			)}`
		);
	},
});

const upload = multer({
	storage: fileStorage,
	limits: "2mb",
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
				new ErrorResponse(
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

route.get("/me", protection, authorize("user"), profileController.getMe);
route.put(
	"/me",
	protection,
	upload.single("display_picture"),
	authorize("user"),
	validate("updateDataUser"),
	validatorMessage,
	profileController.updateMe
);

module.exports = route;
