const express = require("express");
const route = express.Router();

const { validate, validatorMessage } = require("../middlewares/Validator");
const adminController = require("../controllers/adminController");

route.get("/user", adminController.getAllAdmin);
route.post(
	"/register",
	validate("createUser"),
	validatorMessage,
	adminController.createAdmin
);

module.exports = route;
