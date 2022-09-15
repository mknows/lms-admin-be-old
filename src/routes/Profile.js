const express = require("express");
const route = express.Router();

const profileController = require("../controllers/profileController");
const { validate, validatorMessage } = require("../middlewares/Validator");
const { protection, authorize } = require("../middlewares/Authentication");

route.get(
	"/me",
	protection,
	authorize(),
	authorize("lecturer", "student", "user"),
	profileController.getMe
);
route.put(
	"/me",
	protection,
	authorize("lecturer", "student", "user"),
	validate("updateDataUser"),
	validatorMessage,
	profileController.updateMe
);

module.exports = route;
