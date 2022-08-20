const express = require("express");
const route = express.Router();
const userController = require("../controllers/userController");

route.get("/", userController.index);
route.get("/login", userController.login);
route.post("/", userController.create);

module.exports = route;
