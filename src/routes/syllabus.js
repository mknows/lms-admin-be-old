const express = require("express");
const route = express.Router();

const syllabusController = require("../controllers/syllabusController");
const { protection } = require("../middlewares/Authentication");

route.get("/getAllMajors", protection, syllabusController.getAllMajors);

module.exports = route;
