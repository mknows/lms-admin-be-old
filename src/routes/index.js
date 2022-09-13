const express = require("express");
const route = express.Router();

const userRoute = require("./auth");
const profileRoute = require("./Profile");
const adminRoute = require("./admin");

const subjectRoute = require("./subject");
const sessionRoute = require("./session");
const forumRoute = require("./forum");
const quizRoute = require("./quiz");
const moduleRoute = require("./module");
const assignmentRoute = require("./assignment");
const articleRoute = require("./article");

//punya ryo
const administrationRoute = require("./My-Study/Administration");
route.use("/my-study/administrations", administrationRoute);

route.use("/auth", userRoute);
route.use("/profile", profileRoute);
route.use("/admin", adminRoute);


route.use("/subject", subjectRoute);
route.use("/session", sessionRoute);
route.use("/forum", forumRoute);
route.use("/quiz", quizRoute);
route.use("/module", moduleRoute);
route.use("/assignment", assignmentRoute);
route.use("/article", articleRoute);

module.exports = route;
