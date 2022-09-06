const express = require("express");
const route = express.Router();

const userRoute = require("./auth");
const profileRoute = require("./Profile");
const adminRoute = require("./admin");
const forumRoute = require("./forum");
const studikuRoute = require("./studiku");
const createRoute = require("./create");

route.use("/studiku", studikuRoute);
route.use("/profile", profileRoute);
route.use("/auth", userRoute);
route.use("/admin", adminRoute);
route.use("/forum",forumRoute);
route.use("/create", createRoute);

module.exports = route;
