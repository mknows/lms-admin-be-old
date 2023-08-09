const express = require("express");
const route = express.Router();

const { validate, validatorMessage } = require("../middlewares/Validator");
const {
	protection,
	authorize,
	authorizeAdmin,
} = require("../middlewares/Authentication");
const adminController = require("../controllers/adminController");

route.get("/all", protection, authorizeAdmin, adminController.getAllAdmin);
route.get("/user", protection, authorizeAdmin, adminController.searchUser);
route.post("/create", protection, authorizeAdmin, adminController.createAdmin);

// route.post(
// 	"/login",
// 	authorizeAdmin,
// 	validatorMessage,
// 	adminController.loginAdmin
// );

module.exports = route;
