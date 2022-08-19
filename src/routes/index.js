const express = require("express");
const route = express.Router();
const userRoute = require("./user");

route.use("/user", userRoute);

module.exports = route;
