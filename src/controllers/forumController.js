const { Student, Discussion_forum, Comment, Reply } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");

module.exports = {
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/discussionforum/
	 * @access    Public
	 */
	getAllDiscussionForum: asyncHandler(async (req, res) => {
		const data = await Discussion_forum.findAll();
		return res.sendJson(200, true, "sucess get all discussion forums", data);
	}),
	/**
	 * @desc      Get All Forums in session
	 * @route     GET /api/v1/forum/discussionforum/session/:session_id
	 * @access    Public
	 */
	getAllDiscussionForumInSession: asyncHandler(async (req, res) => {
		const { session_id } = req.params;
		const data = await Discussion_forum.findAll({
			where: session_id,
		});
		return res.sendJson(200, true, "sucess get all df in session", data);
	}),
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/comment
	 * @access    Public
	 */
	getAllComment: asyncHandler(async (req, res) => {
		const data = await Comment.findAll();
		return res.sendJson(200, true, "sucess get all comments", data);
	}),
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/reply
	 * @access    Public
	 */
	getAllReply: asyncHandler(async (req, res) => {
		const data = await Reply.findAll();
		return res.sendJson(200, true, "sucess get all replies", data);
	}),
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/commentondf/:dfId
	 * @access    Public
	 */
	getCommentOnDF: asyncHandler(async (req, res) => {
		const { dfId } = req.params;
		const data = await Comment.findAll({
			where: {
				df_id: dfId,
			},
		});
		return res.sendJson(200, true, "success get comment in a df", data);
	}),
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/replyoncomment/:comment_id
	 * @access    Public
	 */
	getReplyOnComment: asyncHandler(async (req, res) => {
		const { comment_id } = req.params;
		const data = await Reply.findAll({
			where: {
				comment_id: comment_id,
			},
		});
		return res.sendJson(200, true, "sucess get reply on a comment", data);
	}),
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/discussionforum/create
	 * @access    Public
	 */
	createDiscussionForum: asyncHandler(async (req, res) => {
		const { content, title, session_id } = req.body;
		const user_id = req.userData.id;

		const data = await Discussion_forum.create({
			session_id: session_id,
			content: content,
			title: title,
			author_id: user_id,
		});
		return res.sendJson(200, true, "sucess post discussion forum", data);
	}),
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/comment/create
	 * @access    Public
	 */
	createComment: asyncHandler(async (req, res) => {
		const { content, df_id } = req.body;
		const user_id = req.userData.id;

		const data = await Comment.create({
			df_id: df_id,
			content: content,
			author_id: user_id,
		});
		return res.sendJson(200, true, "sucess post comment", data);
	}),
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/reply/create
	 * @access    Public
	 */
	createReply: asyncHandler(async (req, res) => {
		const { content, comment_id } = req.body;
		const user_id = req.userData.id;

		const the_comment = await Comment.findAll({
			where: {
				id: comment_id,
			},
			attributes: ["df_id"],
		});
		const df_id = the_comment[0].dataValues.df_id;
		const data = await Reply.create({
			df_id: df_id,
			comment_id: comment_id,
			content: content,
			author_id: user_id,
		});
		return res.sendJson(200, true, "sucess post reply", data);
	}),

	/**
	 * @desc      update discussion Forums
	 * @route     GET /api/v1/forum/discussionforum/edit/:dfId
	 * @access    Public
	 */
	updateDiscussionForum: asyncHandler(async (req, res) => {
		const { dfId } = req.params;
		let { content, title, session_id } = req.body;
		const user_id = req.userData.id;

		let data = await Discussion_forum.findOne({
			where: {
				id: dfId,
			},
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid df id.",
				data: {},
			});
		}

		if (user_id !== data.author_id) {
			return res.status(404).json({
				success: false,
				message: "updater is not author",
				data: {},
			});
		}
		if (content === null) {
			content = data.content;
		}
		if (title === null) {
			title = data.title;
		}
		if (session_id === null) {
			session_id = data.session_id;
		}

		data = await Discussion_forum.update(
			{
				content,
				title,
				session_id,
			},
			{
				where: { id: dfId },
				returning: true,
			}
		);

		return res.status(200).json({
			success: true,
			message: `Edit Discussion Forum with ID ${dfId} successfully.`,
			data: { ...data[1].dataValues },
		});
	}),

	/**
	 * @desc      update comments
	 * @route     GET /api/v1/forum/comment/edit/:comment_id
	 * @access    Public
	 */
	updateComment: asyncHandler(async (req, res) => {
		const { comment_id } = req.params;
		let { content } = req.body;
		const user_id = req.userData.id;

		let data = await Comment.findOne({
			where: {
				id: comment_id,
			},
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid comment id.",
				data: {},
			});
		}

		if (user_id !== data.author_id) {
			return res.status(404).json({
				success: false,
				message: "updater is not author",
				data: {},
			});
		}
		if (content === null) {
			content = data.content;
		}

		data = await Discussion_forum.update(
			{
				content,
			},
			{
				where: { id: comment_id },
				returning: true,
			}
		);

		return res.status(200).json({
			success: true,
			message: `Edit comment with ID ${comment_id} successfully.`,
			data: { ...data[1].dataValues },
		});
	}),

	/**
	 * @desc      update discussion Forums
	 * @route     GET /api/v1/forum/reply/edit/:reply_id
	 * @access    Public
	 */
	updateReply: asyncHandler(async (req, res) => {
		const { reply_id } = req.params;
		let { content } = req.body;
		const user_id = req.userData.id;

		let data = await Reply.findOne({
			where: {
				id: reply_id,
			},
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid reply id.",
				data: {},
			});
		}

		if (user_id !== data.author_id) {
			return res.status(404).json({
				success: false,
				message: "updater is not author",
				data: {},
			});
		}
		if (content === null) {
			content = data.content;
		}

		data = await Reply.update(
			{
				content,
			},
			{
				where: { id: reply_id },
				returning: true,
			}
		);

		return res.status(200).json({
			success: true,
			message: `Edit Discussion Forum with ID ${reply_id} successfully.`,
			data: { ...data[1].dataValues },
		});
	}),
	/**
	 * @desc      delete df
	 * @route     DELETE /api/v1/forum/discussionforum/delete/:dfId
	 * @access    Private
	 */
	deleteDiscussionForum: asyncHandler(async (req, res) => {
		const { dfId } = req.params;
		let data = await Discussion_forum.findOne({
			where: {
				id: dfId,
			},
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid df id.",
				data: {},
			});
		}

		Discussion_forum.destroy({
			where: {
				id: dfId,
			},
		});

		return res.sendJson(200, true, "Success", {});
	}),
	/**
	 * @desc      delete comment
	 * @route     DELETE /api/v1/forum/comment/delete/:comment_id
	 * @access    Private
	 */
	deleteComment: asyncHandler(async (req, res) => {
		const { comment_id } = req.params;
		let data = await Comment.findOne({
			where: {
				id: comment_id,
			},
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid comment id.",
				data: {},
			});
		}

		Comment.destroy({
			where: {
				id: comment_id,
			},
		});

		return res.sendJson(200, true, "Success", {});
	}),
	/**
	 * @desc      delete reply
	 * @route     DELETE /api/v1/forum/reply/delete/:reply_id
	 * @access    Private
	 */
	deleteReply: asyncHandler(async (req, res) => {
		const { reply_id } = req.params;
		let data = await Reply.findOne({
			where: {
				id: reply_id,
			},
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid reply id.",
				data: {},
			});
		}

		Reply.destroy({
			where: {
				id: reply_id,
			},
		});

		return res.sendJson(200, true, "Success", {});
	}),
};
