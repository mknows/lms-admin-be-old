const express = require("express");
const route = express.Router();

const moduleController = require("../controllers/moduleController");
const { protection } = require("../middlewares/Authentication");

route.get("/get/:id", protection, moduleController.getModule);
route.get("/video/:id", protection, moduleController.getVideo);
route.get("/document/:id", protection, moduleController.getDocument);

route.post("/create", protection, moduleController.postModule);
route.post("/createvideo", protection, moduleController.postVideo);
route.post("/createdocument", protection, moduleController.postDocument);

module.exports = route;
