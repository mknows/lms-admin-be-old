const {
	Module,
	Video,
	Document,
	Material,
	MaterialEnrolled,
	Session,
	StudentSession,
} = require("../models");
const moment = require("moment");
const { Op, Sequelize } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const scoringFunctions = require("../functions/scoringFunctions");
const checkDoneSession = require("../helpers/checkDoneSession");
require("dotenv").config();
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
const sessionController = require("./sessionController");

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
			let met_enr = await MaterialEnrolled.findOne({
				where: {
					id_referrer: currmod.id,
					student_id: student_id,
				},
				attribute: ["status"],
			});

			let stat;
			let takeaway = null;
			if (!met_enr) {
				stat = NOT_ENROLLED;
			} else {
				stat = met_enr.status;
				takeaway = met_enr.activity_detail?.takeaway;
			}

			let datval = {
				...currmod.dataValues,
				status: stat,
				takeaway: takeaway,
			};

			result.push(datval);
		}

		return res.sendJson(200, true, "Success", result);
	}),
	/**
	 * @desc      Get Module
	 * @route     GET /api/v1/module/:id
	 * @access    Private
	 */
	getModule: asyncHandler(async (req, res) => {
		const module_id = req.params.id;
		const student_id = req.student_id;
		const mod = await Module.findOne({
			where: {
				id: module_id,
			},
		});
		if (!mod) return res.sendJson(404, false, "Not Found", {});

		let takeaway = null;
		let date_submitted = null;

		const mat_enr = await MaterialEnrolled.findOne({
			where: {
				student_id,
				id_referrer: mod.id,
			},
			attributes: {
				include: ["updated_at"],
			},
		});

		if (mat_enr != null) {
			if (mat_enr.activity_detail != null) {
				takeaway = mat_enr.activity_detail.takeaway;
				date_submitted = mat_enr.updated_at;
			}
		}

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
		console.log(date_submitted);
		return res.sendJson(200, true, "Success", {
			module: mod,
			takeaway: takeaway,
			date_submitted:
				moment(date_submitted).format("DD/MM/YYYY hh:mm:ss") ||
				"Not yet submitted",
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
		if (!vid) return res.sendJson(404, false, "Not Found", {});
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
		if (!doc) return res.sendJson(404, false, "Not Found", {});
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

		return res.sendJson(200, true, "Success", data);
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
	 * @desc      post make module <DEPRICATED>
	 * @route     POST /api/v1/module/enroll/:module_id
	 * @access    Private
	 */
	takeModule: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const { module_id } = req.params;

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

		const enrolldata = await MaterialEnrolled.create({
			session_id: mod.session_id,
			student_id: student_id,
			subject_id: sesh.subject_id,
			id_referrer: module_id,
			status: ONGOING,
			type: MODULE,
		});

		return res.sendJson(200, true, "Success", enrolldata);
	}),

	/**
	 * @desc      post finish module
	 * @route     POST /api/v1/module/finish/
	 * @access    Private
	 */
	finishModule: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const { module_id, takeaway } = req.body;

		let mod = await Module.findOne({
			where: {
				id: module_id,
			},
		});

		if (!mod) {
			return res.sendJson(404, false, "Module Not Found", {});
		}

		let sesh = await Session.findOne({
			where: {
				id: mod.session_id,
			},
		});

		if (!sesh) {
			return res.sendJson(404, false, "Session Not Found", {});
		}

		let detail = {
			date_submitted: moment().format("DD/MM/YYYY hh:mm:ss"),
			takeaway: takeaway,
		};

		let student_sesh = await StudentSession.findOne({
			where: {
				student_id,
				session_id: mod.session_id,
			},
		});

		if (!student_sesh) {
			student_sesh = await StudentSession.create({
				session_id: mod.session_id,
				student_id: student_id,
				present: false,
			});
		}

		let material_enrolled_data = await MaterialEnrolled.findOne({
			where: {
				student_id,
				id_referrer: module_id,
			},
		});

		if (!material_enrolled_data) {
			material_enrolled_data = await MaterialEnrolled.create({
				session_id: mod.session_id,
				student_id: student_id,
				subject_id: sesh.subject_id,
				id_referrer: module_id,
				type: MODULE,
				activity_detail: detail,
				status: FINISHED,

				score: 100,
			});
		} else {
			material_enrolled_data = await MaterialEnrolled.update(
				{
					activity_detail: detail,
					status: FINISHED,

					score: 100,
				},
				{
					where: {
						student_id,
						id_referrer: module_id,
					},
					returning: true,
				}
			);
			material_enrolled_data = material_enrolled_data[1][0];
		}

		await checkDoneSession(student_id, material_enrolled_data.session_id);

		return res.sendJson(200, true, "Success", material_enrolled_data);
	}),
};
