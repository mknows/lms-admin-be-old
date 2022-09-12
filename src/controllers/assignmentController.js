const { Assignment, Material } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");

module.exports = {
	/**
	 * @desc      Get Assignment
	 * @route     GET /api/v1/assignment/get/:id
	 * @access    Private
	 */
	getAssignment: async (req, res) => {
		try {
			const assignmentID = req.params.id;
			const assign = await Assignment.findAll({
				where: {
					id: assignmentID,
				},
			});
			res.sendJson(200, true, "Success", assign);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      POST create Assignment
	 * @route     GET /api/v1/assignment/create
	 * @access    Private
	 */
	postAssignment: async (req, res) => {
		const { session_id, duration, description, content, document_id } =
			req.body;

		try {
			const assign = await Assignment.create({
				session_id: session_id,
				duration: duration,
				description: description,
				content: content,
				document_id: document_id,
			});

			await Material.create({
				session_id: session_id,
				duration: duration,
				description: description,
				type: "ASSIGNMENT",
				id_referrer: assign.id,
			});

			res.sendJson(200, true, "Success", assign);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
};
