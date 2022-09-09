const {
	Session
} = require('../models')
const moment = require('moment')
const {Op} = require("sequelize")

module.exports = {
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/session/create
	 * @access    Public
	 */
	postSession: async (req, res) => {
        const {subject_id, 
            session_no,
            duration,
            is_sync,
            type,
            description} = req.body
		try {
			const data = await Session.create({
                subject_id: subject_id,
                session_no: session_no,
                duration: duration,
                is_sync: is_sync,
                type: type,
                description: description
            })
			res.sendJson(
				200, 
				true, 
				"success make session", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      Get All Session in Subject
	 * @route     GET /api/v1/session/getall/:sub_id
	 * @access    Public
	 */
	 getAllSessionInSubject: async (req, res) => {
		try {
			const sub_id =  req.params.sub_id
			const data = await Session.findAll({
				where : {
					subject_id: sub_id
				}
			});
			res.sendJson(
				200, 
				true, 
				"success get all session in sub", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	}
};