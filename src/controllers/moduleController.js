const {Student, 
	Subject, 
	Material_Enrolled,
	Module,
	Video,
	Document,
	Quiz,
	StudentSubject,
	Major,
	Session, 
	Material
} = require('../models')
const moment = require('moment')
const {Op} = require("sequelize")

module.exports = {
	/**
	 * @desc      Get Module
	 * @route     GET /api/v1/module/get/:id
	 * @access    Private
	 */
	getModule: async (req,res) => {
		try {
			const moduleID = req.params.id
			const moduleData = await Module.findAll({
			where: {
				id: moduleID
			},
			include: [
				{
					model:Document
				},
				{
					model:Video
				}
			]
		})
			res.sendJson(200,true,"Success", moduleData)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
    /**
	 * @desc      Get video
	 * @route     GET /api/v1/module/video/:id
	 * @access    Private
	 */
	getVideo: async (req,res) => {
		try {
			const videoID = req.params.id
			const vid = await Video.findOne({
                where: {
                    id: videoID
                }
            })
			res.sendJson(200,true,"Success", vid)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
    /**
	 * @desc      Get dokument
	 * @route     GET /api/v1/module/document/:id
	 * @access    Private
	 */
	getDocument: async (req,res) => {
		try {
			const documentID = req.params.id
			const doc = await Document.findOne({
                where: {
                    id: documentID
                }
            })
			res.sendJson(200,true,"Success", doc)
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
};