const express = require("express");
const route = express.Router();

const pingController = require("../controllers/pingController");

route.get("/ping", pingController.testAPI);
route.get("/materialenrolled", pingController.materialEnrolled);

module.exports = route;
