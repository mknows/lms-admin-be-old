const express = require("express");
const route = express.Router();

const userRoute = require("./auth");
const profileRoute = require("./Profile");
const adminRoute = require("./admin");

const subjectRoute = require("./subject");
const sessionRoute = require("./session");
const guideRoute = require("./guide");
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
const previewRoute = require("./preview");
const leaderboardRoute = require("./leaderboard");
const facultyRoute = require("./faculty");
const eventRoute = require("./event");
const calendarRoute = require("./calendar");
const jobRoute = require("./job");
const meetingRoute = require("./meeting");
const serviceRoute = require("./services");
const careerRoute = require("./career");

const pingRoutes = require("./ping");

//punya ryo
const administrationRoute = require("./Administration");
const pingController = require("../controllers/pingController");
route.use("/administration", administrationRoute);

route.use("/auth", userRoute);
route.use("/profile", profileRoute);
route.use("/admin", adminRoute);
route.use("/guide", guideRoute);
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
route.use("/calendar", calendarRoute);
route.use("/preview", previewRoute);
route.use("/leaderboard", leaderboardRoute);
route.use("/faculty", facultyRoute);
route.use("/jobs", jobRoute);
route.use("/events", eventRoute);
route.use("/meeting", meetingRoute);
route.use("/services", serviceRoute);
route.use("/career", careerRoute);

module.exports = route;
