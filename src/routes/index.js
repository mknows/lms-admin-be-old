const express = require("express");
const route = express.Router();

const userRoute = require("./Auth");
const profileRoute = require("./Profile");
const adminRoute = require("./admin");

route.use("/profile", profileRoute);
route.use("/auth", userRoute);
route.use("/admin", adminRoute);

module.exports = route;
