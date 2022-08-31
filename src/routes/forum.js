const express = require("express");
const route = express.Router();

const forumController = require("../controllers/forumController");
const { protection } = require("../middlewares/Authentication");

route.get("/getAllDisccussionForum", protection, forumController.getAllDiscussionForum);
route.get("/getAllComment", protection, forumController.getAllComment);
route.get("/getAllReply", protection, forumController.getAllReply);

route.get("/getCommentOnDF/:df_id", protection, forumController.getCommentOnDF);

module.exports = route;