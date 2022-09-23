const express = require("express");
const route = express.Router();

const forumController = require("../controllers/forumController");
const { protection } = require("../middlewares/Authentication");

route.get(
	"/discussionforum",
	protection,
	forumController.getAllDiscussionForum
);

route.get(
	"/discussionforum/session/:session_id",
	protection,
	forumController.getAllDiscussionForumInSession
);
route.get("/comment", protection, forumController.getAllComment);
route.get("/reply", protection, forumController.getAllReply);

route.get("/commentondf/:dfId", protection, forumController.getCommentOnDF);
route.get(
	"/replyoncomment/:comment_id",
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
	"/comment/edit/:comment_id",
	protection,
	forumController.updateComment
);
route.put("/reply/edit/:reply_id", protection, forumController.updateReply);

route.delete(
	"/discussionforum/delete/:dfId",
	protection,
	forumController.deleteDiscussionForum
);
route.delete(
	"/comment/delete/:comment_id",
	protection,
	forumController.deleteComment
);
route.delete(
	"/reply/delete/:reply_id",
	protection,
	forumController.deleteReply
);

module.exports = route;
