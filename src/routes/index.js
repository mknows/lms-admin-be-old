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
const majorRoute = require("./major");
const materialEnrolledRoute = require("./materialEnrolled");
const syllabusRoute = require("./syllabus");
const documentRoute = require("./document");
const certificateController = require("./certificate");
const notificationRoute = require("./notification");
const reportRoute = require("./report");

const pingRoutes = require("./ping");

//punya ryo
const administrationRoute = require("./Administration");
const pingController = require("../controllers/pingController");
route.use("/administration", administrationRoute);

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
route.use("/major", majorRoute);
route.use("/materialenrolled", materialEnrolledRoute);
route.use("/syllabus", syllabusRoute);
route.use("/document", documentRoute);
route.use("/certificate", certificateController);
route.use("/notification", notificationRoute);
route.use("/report", reportRoute);

route.use("/test", pingRoutes);

module.exports = route;
