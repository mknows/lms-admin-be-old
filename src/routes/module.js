const express = require("express");
const route = express.Router();

const moduleController = require("../controllers/moduleController");
const { protection } = require("../middlewares/Authentication");
route.post("/create", protection, moduleController.createModule);
route.post("/createvideo", protection, moduleController.createVideo);
route.post("/createdocument", protection, moduleController.createDocument);

route.get("/", protection, moduleController.getAllModule);
route.get("/video", protection, moduleController.getAllVideo);
route.get("/document", protection, moduleController.getAllDocument);

route.get(
	"/session/:sessionId",
	protection,
	moduleController.getModuleInSession
);

route.get("/:id", protection, moduleController.getModule);
route.get("/video/:id", protection, moduleController.getVideo);
route.get("/document/:id", protection, moduleController.getDocument);

route.put("/edit/:moduleId", protection, moduleController.editModule);
route.put("/video/edit/:videoId", protection, moduleController.editVideo);
route.put(
	"/document/edit/:documentId",
	protection,
	moduleController.editDocument
);

route.delete("/delete/:moduleId", protection, moduleController.deleteModule);
route.delete(
	"/video/delete/:videoId",
	protection,
	moduleController.deleteVideo
);
route.delete(
	"/document/delete/:documentId",
	protection,
	moduleController.deleteDocument
);

module.exports = route;
