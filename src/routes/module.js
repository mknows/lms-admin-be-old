const express = require("express");
const route = express.Router();
const moduleController = require("../controllers/moduleController");
const { protection, authorize } = require("../middlewares/Authentication");

// Module
route.get("/", protection, moduleController.getAllModule);
route.post("/create", protection, moduleController.createModule);
route.put("/edit/:module_id", protection, moduleController.editModule);
route.delete("/delete/:module_id", protection, moduleController.deleteModule);
route.get("/:id", protection, moduleController.getModule);

// Video
route.post("/createvideo", protection, moduleController.createVideo);
route.get("/video", protection, moduleController.getAllVideo);
route.put("/video/edit/:video_id", protection, moduleController.editVideo);
route.get("/video/:id", protection, moduleController.getVideo);
route.delete(
	"/video/delete/:video_id",
	protection,
	moduleController.deleteVideo
);

// Document
route.post("/createdocument", protection, moduleController.createDocument);
route.get("/document", protection, moduleController.getAllDocument);
route.put(
	"/document/edit/:document_id",
	protection,
	moduleController.editDocument
);
route.get("/document/:id", protection, moduleController.getDocument);
route.delete(
	"/document/delete/:document_id",
	protection,
	moduleController.deleteDocument
);

// Actions
route.get(
	"/session/:session_id",
	protection,
	authorize("student"),
	moduleController.getModuleInSession
);
route.post(
	"/enroll/:module_id",
	protection,
	authorize("student"),
	moduleController.takeModule
);
route.post(
	"/finish",
	protection,
	authorize("student"),
	moduleController.finishModule
);

module.exports = route;
