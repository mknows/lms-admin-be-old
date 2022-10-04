const express = require("express");
const route = express.Router();
const multer = require("multer");

const documentControlller = require("../controllers/documentController");
const { protection } = require("../middlewares/Authentication");
const { validate, validatorMessage } = require("../middlewares/Validator");

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
	// validate("createDocumentQuestion"),
	// validatorMessage,
	upload.single("file"),
	documentControlller.createDocument
);
route.put(
	"/update/:document_id",
	protection,
	upload.single("file"),
	documentControlller.updateDocument
);

route.delete(
	"/delete/:document_id",
	protection,
	documentControlller.deleteDocument
);

route.get("/", protection, documentControlller.getAllData);

module.exports = route;
