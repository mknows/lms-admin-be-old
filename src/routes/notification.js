const express = require("express");
const route = express.Router();
const { protection, authorize } = require("../middlewares/Authentication");
const routeController = require("../controllers/notificationController");

route.post("/post", protection, routeController.postNotificationGlobal);
route.put("/read", protection, routeController.readNotification);
route.get("/get", protection, routeController.getNotification);

module.exports = route;
