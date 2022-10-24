const express = require("express");
const route = express.Router();
const moduleController = require("../controllers/moduleController");
const { protection, authorize } = require("../middlewares/Authentication");

// Module
route.get("/", protection, authorize("student"), moduleController.getAllModule);
route.post(
	"/create",
	protection,
	authorize("student"),
	moduleController.createModule
);
route.put(
	"/edit/:module_id",
	protection,
	authorize("student"),
	moduleController.editModule
);
route.delete(
	"/delete/:module_id",
	protection,
	authorize("student"),
	moduleController.deleteModule
);
route.get("/:id", protection, authorize("student"), moduleController.getModule);

// Video
route.post(
	"/createvideo",
	protection,
	authorize("student"),
	moduleController.createVideo
);
route.get(
	"/video",
	protection,
	authorize("student"),
	moduleController.getAllVideo
);
route.put(
	"/video/edit/:video_id",
	protection,
	authorize("student"),
	moduleController.editVideo
);
route.get(
	"/video/:id",
	protection,
	authorize("student"),
	moduleController.getVideo
);
route.delete(
	"/video/delete/:video_id",
	protection,
	authorize("student"),
	moduleController.deleteVideo
);

// Document
route.post(
	"/createdocument",
	protection,
	authorize("student"),
	moduleController.createDocument
);
route.get(
	"/document",
	protection,
	authorize("student"),
	moduleController.getAllDocument
);
route.put(
	"/document/edit/:document_id",
	protection,
	authorize("student"),
	moduleController.editDocument
);
route.get(
	"/document/:id",
	protection,
	authorize("student"),
	moduleController.getDocument
);
route.delete(
	"/document/delete/:document_id",
	protection,
	authorize("student"),
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
