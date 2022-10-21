const express = require("express");
const route = express.Router();

const sessionController = require("../controllers/sessionController");
const { protection, authorize, enrolled, existence } = require("../middlewares/Authentication");

const { Subject, Session } = require("../models");

route.post("/create", protection, sessionController.createSession);
route.get("/", protection, sessionController.getAllSessions);
route.get("/:session_id", 
	protection, 
	authorize("student","user"),
	existence(Session),
	enrolled(Session),
	sessionController.getSession);
route.get(
	"/getfromsub/:subject_id",
	protection,
	authorize("student","user"),
	existence(Subject),
	enrolled(Subject),
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
