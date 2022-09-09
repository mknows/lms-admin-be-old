const express = require("express");
const route = express.Router();

const assignmentController = require("../controllers/assignmentController");
const { protection } = require("../middlewares/Authentication");

route.get("/get/:id", protection, assignmentController.getAssignment);

route.get("/create", protection, assignmentController.postAssignment);

module.exports = route;