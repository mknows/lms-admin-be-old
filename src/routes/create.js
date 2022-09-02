const express = require("express");
const route = express.Router();

const createController = require("../controllers/createController");
const { protection } = require("../middlewares/Authentication");

route.post("/Subject/", protection, createController.postSubject);
route.post("/Session/", protection, createController.postSession);

module.exports = route;