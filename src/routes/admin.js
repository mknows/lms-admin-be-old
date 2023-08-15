const express = require("express");
const route = express.Router();

const { validate, validatorMessage } = require("../middlewares/Validator");
const { protection, authorizeAdmin } = require("../middlewares/Authentication");
const adminController = require("../controllers/adminController");

route.get("/all", protection, authorizeAdmin, adminController.getAllAdmin);
route.get("/user", protection, authorizeAdmin, adminController.searchUser);
route.get("/me", protection, authorizeAdmin, adminController.getAdminProfile);

route.post("/create", protection, authorizeAdmin, adminController.createAdmin);

route.delete(
	"/nukeusers",
	protection,
	authorizeAdmin,
	adminController.deleteAllUser
);
module.exports = route;
