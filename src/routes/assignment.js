const express = require("express");
const route = express.Router();

const assignmentController = require("../controllers/assignmentController");
const { protection } = require("../middlewares/Authentication");

route.post("/create", protection, assignmentController.createAssignment);

route.get("/", protection, assignmentController.getAllAssignment);
route.get(
	"/session/:session_id",
	protection,
	assignmentController.getAssignmentInSession
);
route.get("/:assignment_id", protection, assignmentController.getAssignment);

route.put(
	"/edit/:assignment_id",
	protection,
	assignmentController.updateAssignment
);
route.delete(
	"/delete/:assignment_id",
	protection,
	assignmentController.removeAssignment
);

module.exports = route;
