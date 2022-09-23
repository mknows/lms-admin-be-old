const express = require("express");
const route = express.Router();

const majorController = require("../controllers/majorController");
const { protection } = require("../middlewares/Authentication");

route.get("/", protection, majorController.getAllMajors);
route.get("/:major_id", protection, majorController.getMajor);

route.post("/create", protection, majorController.postMajor);
route.put("/edit/:major_id", protection, majorController.editMajor);
route.delete("/delete/:major_id", protection, majorController.removeMajor);

module.exports = route;
