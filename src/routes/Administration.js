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

const upload = multer({
	storage: multer.memoryStorage(),
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
	"/getcurrentuseradmindata",
	protection,
	authorize("user"),
	administrationController.getCurrentUserAdminData
);

route.post(
	"/biodata",
	protection,
	authorize("user"),
	administrationController.selfDataAdministration
);
route.post(
	"/familial",
	protection,
	authorize("user"),
	administrationController.familialAdministration
);
route.post(
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
	administrationController.createAdministration
);
route.post(
	"/degree",
	protection,
	authorize("user"),
	administrationController.degreeAdministration
);

route.post(
	"/create-administration",
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
	administrationController.createAdministration
);

route.get("/file/:id", administrationController.getFile);

route.delete("/delete/:id", administrationController.deleteAdministration);

module.exports = route;
