const express = require("express");
const route = express.Router();

const forumController = require("../controllers/forumController");
const { protection } = require("../middlewares/Authentication");

route.get(
	"/discussionforum",
	protection,
	forumController.getAllDiscussionForum
);
route.get("/comment", protection, forumController.getAllComment);
route.get("/reply", protection, forumController.getAllReply);

route.get("/commentondf/:dfId", protection, forumController.getCommentOnDF);
route.get(
	"/replyoncomment/:commentId",
	protection,
	forumController.getReplyOnComment
);

route.post(
	"/discussionforum/create",
	protection,
	forumController.createDiscussionForum
);
route.post("/comment/create", protection, forumController.createComment);
route.post("/reply/create", protection, forumController.createReply);

route.put(
	"/discussionforum/edit/:dfId",
	protection,
	forumController.updateDiscussionForum
);
route.put(
	"/comment/edit/:commentId",
	protection,
	forumController.updateComment
);
route.put("/reply/edit/:replyId", protection, forumController.updateReply);

route.delete(
	"/discussionforum/delete/:dfId",
	protection,
	forumController.deleteDiscussionForum
);
route.delete(
	"/comment/delete/:commentId",
	protection,
	forumController.deleteComment
);
route.delete("/reply/delete/:replyId", protection, forumController.deleteReply);

module.exports = route;
