const express = require("express");
const route = express.Router();

const userRoute = require("./Auth");
const profileRoute = require("./Profile");

route.use("/profile", profileRoute);
route.use("/auth", userRoute);

module.exports = route;