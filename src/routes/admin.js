const express = require("express");
const route = express.Router();

const { validate, validatorMessage } = require("../middlewares/Validator");
const { protection, authorize } = require("../middlewares/Authentication");
const adminController = require("../controllers/adminController");

route.get("/user", adminController.getAllAdmin);
route.post(
	"/create",
	protection,
	authorize("admin"),
	adminController.createAdmin
);

module.exports = route;
