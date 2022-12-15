const express = require("express");
const route = express.Router();

const careerPathController = require("../controllers/careerPathController");

route.get("/get", careerPathController.getCareerPath);

module.exports = route;
