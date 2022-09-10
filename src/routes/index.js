const express = require("express");
const route = express.Router();

const studikuRoute = require("./studiku");
const createRoute = require("./create");
route.use("/studiku", studikuRoute);
route.use("/create", createRoute);

const userRoute = require("./auth");
const profileRoute = require("./Profile");
const adminRoute = require("./admin");

const subjectRoute = require("./subject");
const sessionRoute = require("./session");
const forumRoute = require("./forum");
const quizRoute = require("./quiz");
const moduleRoute = require("./module");
const assignmentRoute = require("./assignment");

route.use("/auth", userRoute);
route.use("/profile", profileRoute);
route.use("/admin", adminRoute);

route.use("/subject", subjectRoute);
route.use("/session", sessionRoute);
route.use("/forum",forumRoute);
route.use("/quiz", quizRoute);
route.use("/module", moduleRoute);
route.use("/assignment", assignmentRoute);

module.exports = route;
