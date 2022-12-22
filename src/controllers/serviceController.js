const { Service } = require("../models");
const asyncHandler = require("express-async-handler");
const {
	getStorage,
	ref,
	getDownloadURL,
	deleteObject,
} = require("firebase/storage");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

module.exports = {
	/**
	 * @desc      create service request document
	 * @route     POST /api/v1/services/document
	 * @access    Private must be login without role
	 */
	createServiceDocument: asyncHandler(async (req, res) => {
		const { name, nim, email, message, priority } = req.body;
		const { id } = req.userData;

		const bucket = admin.storage().bucket();
		const storage = getStorage();

		const fileName =
			"documents/services/" +
			uuidv4() +
			"-" +
			req.file.originalname.split(" ").join("-");
		const fileBuffer = req.file.buffer;

		bucket
			.file(fileName)
			.createWriteStream()
			.end(fileBuffer)
			.on("finish", () => {
				getDownloadURL(ref(storage, fileName)).then(async (linkFile) => {
					const created = await Service.create({
						name,
						nim,
						email,
						message,
						priority,
						user_id: id,
						status: "pending",

						document: fileName,
						document_name: req.file.originalname,
						document_link: linkFile,
					});

					return await res.sendJson(
						201,
						true,
						"Service request created",
						created
					);
				});
			});
	}),

	/**
	 * @desc      get status service request
	 * @route     GET /api/v1/services/
	 * @access    Private must be login
	 */
	getStatusService: asyncHandler(async (req, res) => {
		const { id } = req.userData;

		const findService = await Service.findAll({
			where: {
				user_id: id,
			},
			attributes: {
				include: ["created_at"],
				exclude: ["document", "document_name"],
			},
		});

		if (!findService) {
			return res.sendJson(404, false, "Service request not found", null);
		}

		return res.sendJson(200, true, "Service request found", findService);
	}),

	/**
	 * @desc      get status service request by id
	 * @route     GET /api/v1/services/:uuid
	 * @access    Private must be login
	 */
	getStatusServiceById: asyncHandler(async (req, res) => {
		const { id } = req.userData;
		const { uuid } = req.params;

		const findService = await Service.findOne({
			where: {
				id: uuid,
				user_id: id,
			},
			attributes: {
				include: ["created_at"],
				exclude: ["document", "document_name"],
			},
		});

		if (!findService) {
			return res.sendJson(404, false, "Service request by id not found", null);
		}

		return res.sendJson(200, true, "Service request found", findService);
	}),
	/**
	 * @desc      update status service request
	 * @route     PUT /api/v1/services/:uuid
	 * @access    Private must be login
	 */
	// ! belom kelar harus melewati middleware akun Admin
	updateStatusService: asyncHandler(async (req, res) => {
		const { id } = req.userData;
		const { uuid } = req.params;
		const { status } = req.body;

		const findService = await Service.findOne({
			where: {
				id: uuid,
				user_id: id,
			},
		});

		if (!findService) {
			return res.sendJson(404, false, "Service request by id not found", null);
		}

		const updated = await findService.update({
			status,
		});

		return res.sendJson(200, true, "Service request updated", updated);
	}),
};
