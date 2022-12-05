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

const previewController = require("../controllers/previewController");

route.post("/create", upload.single("image"), previewController.createPreview);
route.get("/", previewController.getAllPreview);

module.exports = route;
