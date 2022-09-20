const express = require("express");
const route = express.Router();

const materialEnrolledController = require("../controllers/materialEnrolledController");
const { protection } = require("../middlewares/Authentication");

route.put("/finish", protection, materialEnrolledController.finishMaterial);

route.get(
	"/bytype/:type",
	protection,
	materialEnrolledController.getMaterialEnrolled
);

route.get(
	"/history",
	protection,
	materialEnrolledController.getMaterialHistory
);

module.exports = route;
