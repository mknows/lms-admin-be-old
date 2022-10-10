const {
	Module,
	Video,
	Document,
	Material,
	Material_Enrolled,
	Session,
} = require("../models");
const moment = require("moment");
const { Op, Sequelize } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const scoringController = require("./scoringController");
const { SessionFlusher } = require("@sentry/hub");
require("dotenv").config({ path: __dirname + "/controllerconfig.env" });
const {
	DRAFT,
	PENDING,
	ONGOING,
	GRADING,
	PASSED,
	FAILED,
	FINISHED,
	NOT_ENROLLED,

	MODULE,
} = process.env;

module.exports = {
	/**
	 * @desc      post make module
	 * @route     POST /api/v1/module/create
	 * @access    Private
	 */
	createModule: asyncHandler(async (req, res) => {
		const { session_id, video_id, document_id } = req.body;

		const modcr = await Module.create({
			session_id: session_id,
			video_id: video_id,
			document_id: document_id,
		});

		await Material.create({
			session_id: session_id,
			type: "MODULE",
		});

		return res.sendJson(200, true, "Success", modcr);
	}),
	/**
	 * @desc      post make video
	 * @route     POST /api/v1/module/createvideo
	 * @access    Private
	 */
	createVideo: asyncHandler(async (req, res) => {
		const { url, description } = req.body;

		const vidcr = await Video.create({
			url: url,
			description: description,
		});

		return res.sendJson(200, true, "Success", vidcr);
	}),
	/**
	 * @desc      post make video
	 * @route     POST /api/v1/module/createdocument
	 * @access    Private
	 */
	createDocument: asyncHandler(async (req, res) => {
		const { content, file, description } = req.body;

		const doccr = await Document.create({
			content: content,
			file: file,
			description: description,
		});

		return res.sendJson(200, true, "Success", doccr);
	}),
	/**
	 * @desc      Get all Module
	 * @route     GET /api/v1/module/
	 * @access    Private
	 */
	getAllModule: asyncHandler(async (req, res) => {
		const data = await Module.findAll();
		return res.sendJson(200, true, "Success", data);
	}),
	/**
	 * @desc      Get all video
	 * @route     GET /api/v1/module/video
	 * @access    Private
	 */
	getAllVideo: asyncHandler(async (req, res) => {
		const data = await Video.findAll();
		return res.sendJson(200, true, "Success", data);
	}),
	/**
	 * @desc      Get all documents
	 * @route     GET /api/v1/module/document
	 * @access    Private
	 */
	getAllDocument: asyncHandler(async (req, res) => {
		const data = await Document.findAll();
		return res.sendJson(200, true, "Success", data);
	}),
	/**
	 * @desc      Get Modules in sessino
	 * @route     GET /api/v1/module/session/:session_id
	 * @access    Private
	 */
	getModuleInSession: asyncHandler(async (req, res) => {
		const { session_id } = req.params;
		const student_id = req.student_id;
		const mods = await Module.findAll({
			where: {
				session_id,
			},
			attributes: ["id", "description", "document_id", "video_id"],
			order: ["created_at"],
		});

		let result = [];

		for (let i = 0; i < mods.length; i++) {
			mods[i].dataValues.content_length = {
				number_of_video: mods[i].video_id.length,
				number_of_document: mods[i].document_id.length,
			};
		}

		for (let i = 0; i < mods.length; i++) {
			let currmod = mods[i];
			let met_enr = await Material_Enrolled.findOne({
				where: {
					id_referrer: currmod.id,
					student_id: student_id,
				},
				attribute: ["status"],
			});

			let stat;
			if (!met_enr) {
				stat = NOT_ENROLLED;
			} else {
				stat = met_enr.status;
			}

			let progress = 0;

			let datval = {
				modul: currmod,
				status: stat,
				progress: progress,
			};

			result.push(datval);
		}

		return res.sendJson(200, true, "Success", mods);
	}),
	/**
	 * @desc      Get Module
	 * @route     GET /api/v1/module/:id
	 * @access    Private
	 */
	getModule: asyncHandler(async (req, res) => {
		const module_id = req.params.id;
		const mod = await Module.findOne({
			where: {
				id: module_id,
			},
		});

		const vids = await Video.findAll({
			where: {
				id: {
					[Op.in]: mod.video_id,
				},
			},
		});

		const docs = await Document.findAll({
			where: {
				id: {
					[Op.in]: mod.document_id,
				},
			},
		});
		return res.sendJson(200, true, "Success", {
			module: mod,
			videos: vids,
			documents: docs,
		});
	}),
	/**
	 * @desc      Get video
	 * @route     GET /api/v1/module/video/:id
	 * @access    Private
	 */
	getVideo: asyncHandler(async (req, res) => {
		const videoID = req.params.id;
		const vid = await Video.findOne({
			where: {
				id: videoID,
			},
		});
		return res.sendJson(200, true, "Success", vid);
	}),
	/**
	 * @desc      Get document
	 * @route     GET /api/v1/module/document/:id
	 * @access    Private
	 */
	getDocument: asyncHandler(async (req, res) => {
		const documentID = req.params.id;
		const doc = await Document.findOne({
			where: {
				id: documentID,
			},
		});
		return res.sendJson(200, true, "Success", doc);
	}),
	/**
	 * @desc      edit module
	 * @route     PUT /api/v1/module/edit/:module_id
	 * @access    Private
	 */
	editModule: asyncHandler(async (req, res) => {
		const { module_id } = req.params;
		let { session_id, video_id, document_id } = req.body;
		let data = await Module.findOne({
			where: {
				id: module_id,
			},
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid module id.",
				data: {},
			});
		}

		if (session_id === null) {
			session_id = data.session_id;
		}
		if (video_id === null) {
			video_id = data.video_id;
		}
		if (document_id === null) {
			document_id = data.document_id;
		}

		data = await Module.update(
			{
				session_id,
				video_id,
				document_id,
			},
			{
				where: {
					id: module_id,
				},
				returning: true,
			}
		);

		res.sendJson(200, true, "Success", data);
	}),
	/**
	 * @desc      edit video
	 * @route     PUT /api/v1/module/video/edit/:video_id
	 * @access    Private
	 */
	editVideo: asyncHandler(async (req, res) => {
		const { video_id } = req.params;
		let { url, description } = req.body;
		let data = await Video.findOne({
			where: {
				id: video_id,
			},
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid vid id.",
				data: {},
			});
		}

		if (url === null) {
			content = data.content;
		}
		if (description === null) {
			description = data.description;
		}

		data = await Document.update(
			{
				url,
				description,
			},
			{
				where: {
					id: video_id,
				},
				returning: true,
			}
		);

		res.sendJson(200, true, "Success", data);
	}),
	/**
	 * @desc      edit document
	 * @route     PUT /api/v1/module/document/edit/:document_id
	 * @access    Private
	 */
	editDocument: asyncHandler(async (req, res) => {
		const { documentID } = req.params;
		let { content, file, description } = req.body;
		let data = await Document.findOne({
			where: {
				id: documentID,
			},
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid doc id.",
				data: {},
			});
		}

		if (content === null) {
			content = data.content;
		}
		if (file === null) {
			file = data.file;
		}
		if (description === null) {
			description = data.description;
		}

		data = await Document.update(
			{
				content,
				file,
				description,
			},
			{
				where: {
					id: documentID,
				},
				returning: true,
			}
		);

		res.sendJson(200, true, "Success", data);
	}),
	/**
	 * @desc      delete module
	 * @route     DELETE /api/v1/module/delete/:module_id
	 * @access    Private
	 */
	deleteModule: asyncHandler(async (req, res) => {
		const { module_id } = req.params;
		let data = await Module.findOne({
			where: {
				id: module_id,
			},
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid mod id.",
				data: {},
			});
		}

		Module.destroy({
			where: {
				id: module_id,
			},
		});

		res.sendJson(200, true, "Success", {});
	}),
	/**
	 * @desc      delete video
	 * @route     DELETE /api/v1/module/video/delete/:video_id
	 * @access    Private
	 */
	deleteVideo: asyncHandler(async (req, res) => {
		const { video_id } = req.params;
		let data = await Video.findOne({
			where: {
				id: video_id,
			},
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid vid id.",
				data: {},
			});
		}

		Video.destroy({
			where: {
				id: video_id,
			},
		});

		res.sendJson(200, true, "Success", {});
	}),
	/**
	 * @desc      delete document
	 * @route     DELETE /api/v1/module/document/delete/:document_id
	 * @access    Private
	 */
	deleteDocument: asyncHandler(async (req, res) => {
		const { documentID } = req.params;
		let data = await Document.findOne({
			where: {
				id: documentID,
			},
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid doc id.",
				data: {},
			});
		}

		Document.destroy({
			where: {
				id: documentID,
			},
		});

		res.sendJson(200, true, "Success", {});
	}),
	/**
	 * @desc      post make module
	 * @route     POST /api/v1/module/enroll/:module_id
	 * @access    Private
	 */
	takeModule: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const { module_id } = req.params;

		// const material = await Material.findOne({
		// 	where: {
		// 		id_referrer: module_id,
		// 	},
		// });

		let mod = await Module.findOne({
			where: {
				id: module_id,
			},
		});

		let sesh = await Session.findOne({
			where: {
				id: mod.session_id,
			},
		});

		const enrolldata = await Material_Enrolled.create({
			session_id: mod.session_id,
			student_id: student_id,
			// material_id: material.id,
			subject_id: sesh.subject_id,
			id_referrer: module_id,
			status: ONGOING,
			type: MODULE,
		});
		return res.sendJson(200, true, "Success", enrolldata);
	}),
};
