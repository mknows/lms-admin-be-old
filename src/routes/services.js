const express = require("express");
const route = express.Router();
const multer = require("multer");

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
					"Sorry, this upload only support file with type .pdf .png, .jpg or .jpeg.",
					400
				)
			);
		}
	},
});
const serviceController = require("../controllers/serviceController");
const { protection, authorize } = require("../middlewares/Authentication");

route.post(
	"/document",
	protection,
	upload.single("document"),
	serviceController.createServiceDocument
);

route.get("/", protection, serviceController.getStatusService);

route.get("/:uuid", protection, serviceController.getStatusServiceById);

module.exports = route;
