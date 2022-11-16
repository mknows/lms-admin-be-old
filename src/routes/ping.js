const express = require("express");
const route = express.Router();

const pingController = require("../controllers/pingController");

route.get("/ping", pingController.testAPI);

module.exports = route;
