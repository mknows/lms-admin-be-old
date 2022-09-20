const express = require("express");
const route = express.Router();

const assignmentController = require("../controllers/assignmentController");
const { protection } = require("../middlewares/Authentication");

route.post("/create", protection, assignmentController.createAssignment);

route.get("/", protection, assignmentController.getAllAssignment);
route.get(
	"/session/:sessionId",
	protection,
	assignmentController.getAssignmentInSession
);
route.get("/:assignmentId", protection, assignmentController.getAssignment);

route.put(
	"/edit/:assignmentId",
	protection,
	assignmentController.updateAssignment
);
route.delete(
	"/delete/:assignmentId",
	protection,
	assignmentController.removeAssignment
);

module.exports = route;
