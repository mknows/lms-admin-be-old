const express = require("express");
const route = express.Router();
const facultyController = require("../controllers/facultyController");
const { protection, authorize } = require("../middlewares/Authentication");

// Module

route.post("/create", protection, facultyController.createFaculty);
route.put("/update", protection, facultyController.updateFaculty);
route.delete("/delete", protection, facultyController.deleteFaculty);
route.get("/majors", protection, facultyController.getFacultyMajors);
route.get("/", protection, facultyController.getAllFaculty);

module.exports = route;
