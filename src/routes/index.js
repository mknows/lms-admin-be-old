const express = require("express");
const route = express.Router();

const userRoute = require("./Auth");

route.use("/auth", userRoute);

module.exports = route;