const express = require("express");
const route = express.Router();
const facultyController = require("../controllers/facultyController");
const { protection, authorize } = require("../middlewares/Authentication");

// Module
route.get("/", protection, facultyController.getAllFaculty);

route.get("/majors", protection, facultyController.getFacultyMajors);

module.exports = route;
