const express = require("express");
const route = express.Router();

const sessionController = require("../controllers/sessionController");
const { protection, authorize } = require("../middlewares/Authentication");

route.post("/create", protection, sessionController.createSession);
route.get("/", protection, sessionController.getAllSessions);
route.get("/:session_id", protection, sessionController.getSession);
route.get(
	"/getfromsub/:subject_id",
	protection,
	authorize("student","user"),
	sessionController.getAllSessionInSubject
);
route.put("/edit/:session_id", protection, sessionController.updateSession);
route.delete(
	"/delete/:session_id",
	protection,
	sessionController.removeSession
);

route.post(
	"/enroll/:session_id",
	protection,
	authorize("student"),
	sessionController.takeSession
);

module.exports = route;
