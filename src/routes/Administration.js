const express = require("express");
const route = express.Router();
const multer = require("multer");

const { validate, validatorMessage } = require("../middlewares/Validator");
const administrationController = require("../controllers/administrationController");
const { protection, authorize } = require("../middlewares/Authentication");

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 2000000 },
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
				new Error(
					"Sorry, this upload only support file with type .pdf, .png, .jpg or .jpeg.",
					400
				)
			);
		}
	},
});

route.get(
	"/mine",
	protection,
	authorize("user"),
	administrationController.getCurrentUserAdminData
);

route.put(
	"/biodata",
	protection,
	authorize("user"),
	validate("administrationBiodata"),
	validatorMessage,
	administrationController.selfDataAdministration
);
route.put(
	"/familial",
	protection,
	authorize("user"),
	validate("administrationFamilial"),
	validatorMessage,
	administrationController.familialAdministration
);
route.put(
	"/files",
	protection,
	authorize("user"),
	upload.fields([
		{ name: "integrity_pact", maxCount: 1 },
		{ name: "nin_card", maxCount: 1 },
		{ name: "family_card", maxCount: 1 },
		{ name: "certificate", maxCount: 1 },
		{ name: "photo", maxCount: 1 },
		{ name: "transcript", maxCount: 1 },
		{ name: "recommendation_letter", maxCount: 1 },
	]),
	administrationController.filesAdministration
);
route.put(
	"/degree",
	protection,
	authorize("user"),
	validate("administrationDegree"),
	validatorMessage,
	administrationController.degreeAdministration
);

route.delete(
	"/delete/:id",
	protection,
	authorize("user"),
	administrationController.deleteAdministration
);

module.exports = route;
