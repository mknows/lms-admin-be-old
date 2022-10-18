const express = require("express");
const route = express.Router();
const multer = require("multer");

const certificateController = require("../controllers/certificateController");
const { protection, authorize } = require("../middlewares/Authentication");
const { validate, validatorMessage } = require("../middlewares/Validator");

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 2000000 },
	fileFilter: (req, file, cb) => {
		if (file.mimetype == "application/pdf") {
			return cb(null, true);
		} else {
			cb(null, true);
			return cb(
				new Error("Sorry, this upload only support just file type .pdf", 400)
			);
		}
	},
});

route.post(
	"/create",
	// protection,
	// authorize("admin"),
	// upload.single("certificate"),
	// validate("createCertificate"),
	// validatorMessage,
	certificateController.createCertificate
);

route.get("/:id_certificate", certificateController.getCertificate);

module.exports = route;
