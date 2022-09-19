const { Module, Video, Document, Material } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");

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
			id_referrer: modcr.id,
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
	 * @desc      Get Module
	 * @route     GET /api/v1/module/:id
	 * @access    Private
	 */
	getModule: asyncHandler(async (req, res) => {
		const moduleID = req.params.id;
		const mod = await Module.findOne({
			where: {
				id: moduleID,
			},
		});
		return res.sendJson(200, true, "Success", mod);
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
	 * @route     PUT /api/v1/module/edit/:moduleId
	 * @access    Private
	 */
	editModule: asyncHandler(async (req, res) => {
		const { moduleId } = req.params;
		let { session_id, video_id, document_id } = req.body;
		let data = await Module.findOne({
			where: {
				id: moduleId,
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
					id: moduleId,
				},
				returning: true,
			}
		);

		res.sendJson(200, true, "Success", data);
	}),
	/**
	 * @desc      edit video
	 * @route     PUT /api/v1/module/video/edit/:videoId
	 * @access    Private
	 */
	editVideo: asyncHandler(async (req, res) => {
		const { videoId } = req.params;
		let { url, description } = req.body;
		let data = await Video.findOne({
			where: {
				id: videoId,
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
					id: videoId,
				},
				returning: true,
			}
		);

		res.sendJson(200, true, "Success", data);
	}),
	/**
	 * @desc      edit document
	 * @route     PUT /api/v1/module/document/edit/:documentId
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
	 * @route     DELETE /api/v1/module/delete/:moduleId
	 * @access    Private
	 */
	deleteModule: asyncHandler(async (req, res) => {
		const { moduleId } = req.params;
		let data = await Module.findOne({
			where: {
				id: moduleId,
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
				id: moduleId,
			},
		});

		res.sendJson(200, true, "Success", {});
	}),
	/**
	 * @desc      delete video
	 * @route     DELETE /api/v1/module/video/delete/:videoId
	 * @access    Private
	 */
	deleteVideo: asyncHandler(async (req, res) => {
		const { videoId } = req.params;
		let data = await Video.findOne({
			where: {
				id: videoId,
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
				id: videoId,
			},
		});

		res.sendJson(200, true, "Success", {});
	}),
	/**
	 * @desc      delete document
	 * @route     DELETE /api/v1/module/document/delete/:documentId
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
};
