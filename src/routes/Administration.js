const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const route = express.Router();

const administrationController = require("../controllers/administrationController");
const { protection, authorize } = require("../middlewares/Authentication");

const getExtension = (filename) => {
	var i = filename.lastIndexOf(".");
	return i < 0 ? "" : filename.substr(i);
};

const fileStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/documents");
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
			file.mimetype == "application/pdf" ||
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg"
		) {
			return cb(null, true);
		} else {
			cb(null, true);
			return cb(
				new ErrorResponse(
					"Sorry, this upload only support file with type .pdf, .png, .jpg or .jpeg.",
					400
				)
			);
		}
	},
});

route.post(
	"/create-administration",
	protection,
	authorize("user"),
	upload.fields([
		{ name: "integrity_fact", maxCount: 1 },
		{ name: "nin_card", maxCount: 1 },
		{ name: "family_card", maxCount: 1 },
		{ name: "sertificate", maxCount: 1 },
		{ name: "photo", maxCount: 1 },
		{ name: "transcript", maxCount: 1 },
		{ name: "recomendation_letter", maxCount: 1 },
	]),
	administrationController.createAdministration
);

module.exports = route;
