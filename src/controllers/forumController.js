const {Student, Discussion_Forum, Comment, Reply} = require('../models')
const moment = require('moment');
const comment = require('../models/comment');

module.exports = {
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/allForum
	 * @access    Public
	 */
	getAllDiscussionForum: async (req, res) => {
		try {
			const data = await Discussion_Forum.findAll();
			res.sendJson(
				200, 
				true, 
				"sucess get all data", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/allComment
	 * @access    Public
	 */
	getAllComment: async (req, res) => {
		try {
			const data = await Comment.findAll();
			res.sendJson(
				200, 
				true, 
				"sucess get all data", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/allReply
	 * @access    Public
	 */
	getAllReply: async (req, res) => {
		try {
			const data = await Reply.findAll();
			res.sendJson(
				200, 
				true, 
				"sucess get all data", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/forum/comment/:df_id
	 * @access    Public
	 */
	getCommentOnDF: async (req, res) => {
		try {
            const dfid = req.params.df_id
			const data = await comment.findAll({
                where: {
                    df_id: dfid
                }
            })
			res.sendJson(
				200, 
				true, 
				"sucess get comment", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
}