const {
	Student,
	Lecturer,
	DiscussionForum,
	Comment,
	Reply,
	User,
	Session,
	Subject,
} = require("../models");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const makeslug = require("../helpers/makeslug");
const sequelize = require("sequelize");

module.exports = {
	/**
	 * @desc      Get All content in a df
	 * @route     GET /api/v1/forum/discussionforum/allcontent/:df_id
	 * @access    Public
	 */
	getAllDiscussionForumContent: asyncHandler(async (req, res) => {
		const { df_id } = req.params;
		const { slug_query } = req.query;

		let id_search = null;

		// TODO SLUG
		// let slug_search = null;
		// let slug;

		// if (slug_query) {
		// 	slug_search = await makeslug(slug_query, false);
		// }
		if (df_id) {
			id_search = df_id;
		}

		let data = await DiscussionForum.findOne({
			where: {
				[Op.or]: [
					{ id: id_search },
					{
						title: sequelize.where(
							sequelize.fn("LOWER", sequelize.col("title")),
							slug_search
						),
					},
				],
			},
			attributes: { include: ["created_at", "updated_at"] },
			include: [
				{
					model: User,
					attributes: ["full_name", "display_picture_link"],
				},
				{
					model: Comment,
					attributes: { include: ["created_at", "updated_at"] },
					include: [
						{
							model: User,
							attributes: ["full_name", "display_picture_link"],
						},
						{
							model: Reply,
							attributes: { include: ["created_at", "updated_at"] },
							include: {
								model: User,
								attributes: ["full_name", "display_picture_link"],
							},
						},
					],
				},
			],
			order: [
				[Comment, "created_at", "DESC"],
				[Comment, Reply, "content", "DESC"],
			],
		});

		data = data.dataValues;
		// TODO SLUG
		// slug = await makeslug(data.title.toLowerCase(), true);
		// data.slug = slug;

		return res.sendJson(200, true, "sucess get discussion forum content", data);
	}),
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/discussionforum/
	 * @access    Public
	 */
	getAllDiscussionForumOngoing: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		let result;

		let data;

		data = await Student.findOne({
			where: {
				id: student_id,
			},
			attributes: [],
			include: {
				model: Subject,
				attributes: ["name"],
				through: {
					attributes: [],
				},
				include: {
					model: Session,
					attributes: ["session_no", "id"],
					include: {
						model: DiscussionForum,
						attributes: {
							include: ["created_at", "updated_at"],
							exclude: ["deleted_at", "created_by", "updated_by"],
						},
						include: {
							model: User,
							attributes: ["full_name", "display_picture_link"],
						},
					},
				},
			},
		});

		result = data.Subjects;

		return res.sendJson(
			200,
			true,
			"sucess get all discussion forums in enrolled sessions",
			result
		);
	}),
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/discussionforum/all
	 * @access    Public
	 */
	getAllDiscussionForum: asyncHandler(async (req, res) => {
		const data = await DiscussionForum.findAll({
			attributes: {
				include: ["created_at", "updated_at"],
			},
		});
		return res.sendJson(200, true, "sucess get all discussion forums", data);
	}),
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/discussionforum/global
	 * @access    Public
	 */
	getAllDiscussionForumGlobal: asyncHandler(async (req, res) => {
		const data = await DiscussionForum.findAll({
			where: {
				session_id: null,
			},
			attributes: {
				include: ["created_at", "updated_at"],
			},
		});
		return res.sendJson(
			200,
			true,
			"sucess get all global discussion forums",
			data
		);
	}),
	/**
	 * @desc      Get All Forums in session
	 * @route     GET /api/v1/forum/discussionforum/session/:session_id
	 * @access    Public
	 */
	getAllDiscussionForumInSession: asyncHandler(async (req, res) => {
		const { session_id } = req.params;
		const data = await DiscussionForum.findAll({
			where: {
				session_id: session_id,
			},
			attributes: {
				include: ["created_at", "updated_at"],
			},
			include: {
				model: User,
				attributes: ["full_name", "display_picture_link"],
			},
		});
		return res.sendJson(200, true, "sucess get all df in session", data);
	}),
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/comment
	 * @access    Public
	 */
	getAllComment: asyncHandler(async (req, res) => {
		const data = await Comment.findAll({
			attributes: {
				include: ["created_at", "updated_at"],
			},
		});
		return res.sendJson(200, true, "sucess get all comments", data);
	}),
	/**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/reply
	 * @access    Public
	 */
	getAllReply: asyncHandler(async (req, res) => {
		const data = await Reply.findAll({
			attributes: {
				include: ["created_at", "updated_at"],
			},
		});
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
			attributes: {
				include: ["created_at", "updated_at"],
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
			attributes: {
				include: ["created_at", "updated_at"],
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

		const data = await DiscussionForum.create({
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

		let data = await DiscussionForum.findOne({
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

		data = await DiscussionForum.update(
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

		data = await DiscussionForum.update(
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
		let data = await DiscussionForum.findOne({
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

		DiscussionForum.destroy({
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

	/**
	 * @desc      like thing
	 * @route     PUT /api/v1/forum/like?type=<df|comment|reply>&id=<idnum>
	 * @access    Private
	 */
	likePost: asyncHandler(async (req, res) => {
		let { type, id } = req.query;
		const user_role = req.role;
		const user_id = req.userData.id;

		let index;
		let data;
		let liker_id;
		let likes;
		let unlike;
		switch (type) {
			case "reply":
				data = await Reply.findOne({
					where: {
						id: id,
					},
				});

				if (data == null) {
					return res.sendJson(404, false, "cannot find post", data);
				}

				if (user_role === "student") {
					liker_id = await getLikerId(data.student_like, user_id, user_role);

					unlike = liker_id.unlike;

					if (liker_id.status === false) {
						return res.sendJson(404, false, liker_id.msg, data);
					}
					likes = data.student_like;

					if (unlike) {
						index = likes.indexOf(liker_id.msg);
						if (index > -1) {
							likes.splice(index, 1);
						}
					} else {
						await likes.push(liker_id.msg);
					}

					data = await Reply.update(
						{
							student_like: likes,
						},
						{
							where: { id: id },
							returning: true,
						}
					);
				} else if (user_role === "lecturer") {
					liker_id = await getLikerId(data.lecturer_like, user_id, user_role);
					if (liker_id.status === false) {
						return res.sendJson(404, false, liker_id.msg, data);
					}
					likes = data.lecturer_like;

					unlike = liker_id.unlike;

					if (unlike) {
						index = likes.indexOf(liker_id.msg);
						if (index > -1) {
							likes.splice(index, 1);
						}
					} else {
						await likes.push(liker_id.msg);
					}

					data = await Reply.update(
						{
							lecturer_like: likes,
						},
						{
							where: { id: id },
							returning: true,
						}
					);
				}

				break;
			case "comment":
				data = await Comment.findOne({
					where: {
						id: id,
					},
				});

				if (data == null) {
					return res.sendJson(404, false, "cannot find post", data);
				}

				if (user_role === "student") {
					liker_id = await getLikerId(data.student_like, user_id, user_role);
					if (liker_id.status === false) {
						return res.sendJson(404, false, liker_id.msg, data);
					}
					likes = data.student_like;

					unlike = liker_id.unlike;

					if (unlike) {
						index = likes.indexOf(liker_id.msg);
						if (index > -1) {
							likes.splice(index, 1);
						}
					} else {
						await likes.push(liker_id.msg);
					}

					data = await Comment.update(
						{
							student_like: likes,
						},
						{
							where: { id: id },
							returning: true,
						}
					);
				} else if (user_role === "lecturer") {
					liker_id = await getLikerId(data.lecturer_like, user_id, user_role);
					if (liker_id.status === false) {
						return res.sendJson(404, false, liker_id.msg, data);
					}
					likes = data.lecturer_like;

					unlike = liker_id.unlike;

					if (unlike) {
						index = likes.indexOf(liker_id.msg);
						if (index > -1) {
							likes.splice(index, 1);
						}
					} else {
						await likes.push(liker_id.msg);
					}

					data = await Comment.update(
						{
							lecturer_like: likes,
						},
						{
							where: { id: id },
							returning: true,
						}
					);
				}

				break;
			case "df":
				data = await DiscussionForum.findOne({
					where: {
						id: id,
					},
				});

				if (data == null) {
					return res.sendJson(404, false, "cannot find post", data);
				}

				if (user_role === "student") {
					liker_id = await getLikerId(data.student_like, user_id, user_role);
					if (liker_id.status === false) {
						return res.sendJson(404, false, liker_id.msg, data);
					}
					likes = data.student_like;

					unlike = liker_id.unlike;

					if (unlike) {
						index = likes.indexOf(liker_id.msg);
						if (index > -1) {
							likes.splice(index, 1);
						}
					} else {
						await likes.push(liker_id.msg);
					}

					data = await DiscussionForum.update(
						{
							student_like: likes,
						},
						{
							where: { id: id },
							returning: true,
						}
					);
				} else if (user_role === "lecturer") {
					liker_id = await getLikerId(data.lecturer_like, user_id, user_role);
					if (liker_id.status === false) {
						return res.sendJson(404, false, liker_id.msg, data);
					}
					likes = data.lecturer_like;

					unlike = liker_id.unlike;

					if (unlike) {
						index = likes.indexOf(liker_id.msg);
						if (index > -1) {
							likes.splice(index, 1);
						}
					} else {
						await likes.push(liker_id.msg);
					}

					data = await DiscussionForum.update(
						{
							lecturer_like: likes,
						},
						{
							where: { id: id },
							returning: true,
						}
					);
				}

				break;
		}

		data = data[1];

		return res.sendJson(200, true, "Success", ...data);
	}),
};

async function getLikerId(like_data, user_id, user_role) {
	let liker;
	let unlike = false;

	switch (user_role) {
		case "student":
			liker = await Student.findOne({
				where: {
					user_id: user_id,
				},
			});

			if (liker == null) {
				return {
					msg: "student not found",
					status: false,
				};
			}

			if (like_data.includes(liker.id)) {
				unlike = true;
			}

			liker = liker.id;
			break;

		case "lecturer":
			liker = await Lecturer.findOne({
				where: {
					user_id: user_id,
				},
			});

			if (liker == null) {
				return {
					msg: "lecturer not found",
					status: false,
				};
			}

			if (like_data.includes(liker.id)) {
				unlike = true;
			}

			liker = liker.id;
			break;
	}
	return {
		msg: liker,
		status: true,
		unlike,
	};
}
