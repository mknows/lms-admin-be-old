const {Student, Discussion_forum, Comment, Reply} = require('../models')
const moment = require('moment');

module.exports = {
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/getAllDisccussionForum
	 * @access    Public
	 */
	getAllDiscussionForum: async (req, res) => {
		try {
			const data = await Discussion_forum.findAll();
			res.sendJson(
				200, 
				true, 
				"sucess get all discussion forums", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/getAllComment
	 * @access    Public
	 */
	getAllComment: async (req, res) => {
		try {
			const data = await Comment.findAll();
			res.sendJson(
				200, 
				true, 
				"sucess get all comments", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/getAllReply
	 * @access    Public
	 */
	getAllReply: async (req, res) => {
		try {
			const data = await Reply.findAll();
			res.sendJson(
				200, 
				true, 
				"sucess get all replies", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/getCommentOnDF/:df_id
	 * @access    Public
	 */
	getCommentOnDF: async (req, res) => {
		try {
            const dfid = req.params.df_id
			const data = await Comment.findAll({
                where: {
                    df_id: dfid
                }
            })
			res.sendJson(
				200, 
				true, 
				"sucess get comment in a df", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/getReplyOfComment/:comment_id
	 * @access    Public
	 */
	getReplyOnComment: async (req, res) => {
		try {
            const comment_id = req.params.comment_id
			const data = await Reply.findAll({
                where: {
                    comment_id: comment_id
                }
            })
			res.sendJson(
				200, 
				true, 
				"sucess get reply on a comment", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/makeDiscussionForum/
	 * @access    Public
	 */
	postDiscussionForum: async (req, res) => {
        const {content, title, session_id} = req.body
		console.log(req.userData)
        const user_id = req.userData.id;
		try {
			const data = await Discussion_forum.create({
                session_id:session_id,
                content:content,
                title:title,
                author_id:user_id,

            })
			res.sendJson(
				200, 
				true, 
				"sucess post discussion forum", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/makeComment/
	 * @access    Public
	 */
	postComment: async (req, res) => {
        const {content, df_id} = req.body
        const user_id = req.userData.id;
		try {
			const data = await Comment.create({
                df_id:df_id,
                content:content,
                author_id:user_id,
            
            })
			res.sendJson(
				200, 
				true, 
				"sucess post comment", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/makeReply/
	 * @access    Public
	 */
	postReply: async (req, res) => {
        const {content, comment_id} = req.body
        const user_id = req.userData.id;
		try {
            const the_comment = await Comment.findAll({
                where: {
                    id:comment_id
                }, 
                attributes: [
                    'df_id'
                ]
            })
            const df_id = the_comment[0].dataValues.df_id
			const data = await Reply.create({
                df_id:df_id,
                comment_id:comment_id,
                content:content,
                author_id:user_id,
               
            })
			res.sendJson(
				200, 
				true, 
				"sucess post reply", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
}