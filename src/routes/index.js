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
const myStudyAdminRoute = require("./My-Study/Subject");
const myStudyQuizRoute = require("./My-Study/Quiz");
const myStudyMajorRoute = require("./My-Study/Major");
const administrationRoute = require("./My-Study/Administration");

route.use("/auth", userRoute);
route.use("/profile", profileRoute);
route.use("/admin", adminRoute);
route.use("/my-study", myStudyAdminRoute);
route.use("/my-study/quizzes", myStudyQuizRoute);
route.use("/my-study/majors", myStudyMajorRoute);
route.use("/my-study/administrations", administrationRoute);

route.use("/subject", subjectRoute);
route.use("/session", sessionRoute);
route.use("/forum", forumRoute);
route.use("/quiz", quizRoute);
route.use("/module", moduleRoute);
route.use("/assignment", assignmentRoute);

module.exports = route;
