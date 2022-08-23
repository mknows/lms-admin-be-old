const express = require("express");
const route = express.Router();
const userController = require("../controllers/authController");

route.get("/user", userController.getAllDataUser);
route.post("/login", userController.loginUser);
route.post("/register", userController.createUser);
route.post("/reset-password", userController.requestResetPassword);
route.get("/reset-password/:token", userController.verifyResetPasswordToken);
route.post("/reset-password/:token", userController.resetPassword);
route.post("/verify-email", userController.requestVerifyEmail);
route.get("/verify-email/:token", userController.verifyEmail);

module.exports = route;
