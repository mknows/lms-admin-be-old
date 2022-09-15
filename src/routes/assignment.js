const express = require("express");
const route = express.Router();

const assignmentController = require("../controllers/assignmentController");
const { protection } = require("../middlewares/Authentication");

route.get("/", protection, assignmentController.getAllAssignment);
route.get("/:id", protection, assignmentController.getAssignment);

route.post("/create", protection, assignmentController.postAssignment);

module.exports = route;
