const express = require("express");
const route = express.Router();
const userController = require("../controllers/authController");

route.get("/user", userController.getAllDataUser);
route.post("/login", userController.loginUser);
route.post("/register", userController.createUser);

module.exports = route;
