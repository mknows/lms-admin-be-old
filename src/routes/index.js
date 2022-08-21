const express = require("express");
const route = express.Router();
const userRoute = require("./auth");

route.use("/auth", userRoute);

module.exports = route;
