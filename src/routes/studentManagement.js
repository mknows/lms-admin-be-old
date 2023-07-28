const express = require("express");
const route = express.Router();

const studentManagementController = require("../controllers/studentManagementController");

route.put("/grade/assignment", studentManagementController.gradeAssignment);

route.post("/makeuser/student", studentManagementController.makeUserToStudent);

module.exports = route;
