const express = require("express");
const route = express.Router();

const jobController = require("../controllers/jobController");

route.get("/all", jobController.getAllJobs);
route.get("/job/:id", jobController.getJob);

module.exports = route;
