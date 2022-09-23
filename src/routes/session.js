const express = require("express");
const route = express.Router();

const sessionController = require("../controllers/sessionController");
const { protection } = require("../middlewares/Authentication");

route.post("/create", protection, sessionController.createSession);
route.get("/", protection, sessionController.getAllSessions);
route.get("/:sessionId", protection, sessionController.getSession);
route.get(
	"/getfromsub/:subject_id",
	protection,
	sessionController.getAllSessionInSubject
);
route.put("/edit/:sessionId", protection, sessionController.updateSession);
route.delete("/delete/:sessionId", protection, sessionController.removeSession);

module.exports = route;
