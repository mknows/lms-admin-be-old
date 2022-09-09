const express = require("express");
const route = express.Router();

const studikuRoute = require("./studiku");
const createRoute = require("./create");
route.use("/studiku", studikuRoute);
route.use("/create", createRoute);

const userRoute = require("./auth");
const profileRoute = require("./Profile");
const adminRoute = require("./admin");

const forumRoute = require("./forum");
const subjectRoute = require("./subject");
const sessionRoute = require("./session");
const quizRoute = require("./quiz");

route.use("/auth", userRoute);
route.use("/profile", profileRoute);
route.use("/admin", adminRoute);

route.use("/forum",forumRoute);
route.use("/subject", subjectRoute);
route.use("/session", sessionRoute);
route.use("/quiz", quizRoute);

module.exports = route;
