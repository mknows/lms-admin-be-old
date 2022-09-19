const express = require("express");
const route = express.Router();

const assignmentController = require("../controllers/assignmentController");
const { protection } = require("../middlewares/Authentication");

route.get("/", protection, assignmentController.getAllAssignment);
route.get("/:assignmentId", protection, assignmentController.getAssignment);

route.post("/create", protection, assignmentController.createAssignment);
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
