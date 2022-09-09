const express = require("express");
const route = express.Router();

const sessionController = require("../controllers/sessionController");
const { protection } = require("../middlewares/Authentication");

route.post("/create", protection, sessionController.postSession);

route.get("/getall/:sub_id", protection, sessionController.getAllSessionInSubject);

module.exports = route;