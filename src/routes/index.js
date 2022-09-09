const express = require("express");
const route = express.Router();

const userRoute = require("./Auth");
const profileRoute = require("./Profile");
const myStudyAdminRoute = require("./My-Study/Subject");
const myStudyQuizRoute = require("./My-Study/Quiz");
const myStudyMajorRoute = require("./My-Study/Major");
const administrationRoute = require("./My-Study/Administration");

route.use("/profile", profileRoute);
route.use("/auth", userRoute);
route.use("/my-study", myStudyAdminRoute);
route.use("/my-study/quizzes", myStudyQuizRoute);
route.use("/my-study/majors", myStudyMajorRoute);
route.use("/my-study/administrations", administrationRoute);

module.exports = route;