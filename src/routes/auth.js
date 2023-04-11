const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");

const userController = require("../controllers/authController");
const { validate, validatorMessage } = require("../middlewares/Validator");
const { protection, authorize } = require("../middlewares/Authentication");
const { parseForm } = require("../middlewares/csrf");

route.post(
	"/login",
	validate("loginUser"),
	validatorMessage,
	userController.loginUser
);
route.post(
	"/register",
	validate("createUser"),
	validatorMessage,
	userController.createUser
);
route.post(
	"/verify-email",
	protection,
	userController.requestVerificationEmail
);
route.post(
	"/forget-password",
	validate("forgetPasswordUser"),
	validatorMessage,
	userController.requestResetPassword
);
route.post(
	"/google-validate",
	protection,
	authorize("user"),
	userController.googleValidate
);
route.get("/logout", userController.signOutUser);

module.exports = route;
