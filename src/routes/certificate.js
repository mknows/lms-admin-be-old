const express = require("express");
const route = express.Router();

const certificateController = require("../controllers/certificateController");
const { protection, authorize } = require("../middlewares/Authentication");
const { validate, validatorMessage } = require("../middlewares/Validator");

route.post(
	"/subject",
	protection,
	// authorize("admin"),
	// validate("createCertificate"),
	// validatorMessage,
	certificateController.createCertificateSubjectManual
);
route.post(
	"/training",
	// protection,
	// authorize("admin"),
	// validate("createCertificate"),
	// validatorMessage,
	certificateController.createCertificateTraining
);

route.get("/:id_certificate", certificateController.getCertificate);
route.get(
	"/",
	protection,
	authorize("student"),
	certificateController.getCertificateByStudent
);

module.exports = route;
