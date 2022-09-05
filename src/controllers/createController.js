const {Subject, Session} = require('../models')
const moment = require('moment');

module.exports = {
    /**
	 * @desc      Get All Forums
	 * @route     GET /api/v1/create/Subject
	 * @access    Public
	 */
	postSubject: async (req, res) => {
        const {name, 
            number_of_sessions, 
            program, 
            level, 
            lecturer, 
            description,
			credit} = req.body
		try {
			const data = await Subject.create({
                name: name,
                number_of_sessions:number_of_sessions,
                program: program,
                level: level,
                lecturer: lecturer,
                description: description,
				credit: credit
            })
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
	 * @route     GET /api/v1/create/Session
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
				"sucess get all discussion forums", 
				data
			);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
}