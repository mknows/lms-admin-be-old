const express = require("express");
const route = express.Router();

const userRoute = require("./Auth");
const profileRoute = require("./Profile");
const adminRoute = require("./admin");
const forumRoute = require("./forum")
const studikuRoute = require("./studiku")

route.use("/studiku", studikuRoute);
route.use("/profile", profileRoute);
route.use("/auth", userRoute);
route.use("/admin", adminRoute);
route.use("/forum",forumRoute)

module.exports = route;
