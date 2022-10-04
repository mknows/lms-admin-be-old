const { Document } = require("../models");
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
	 * @desc      Create new Document Question
	 * @route     POST /api/v1/document/create
	 * @access    Private
	 */
	createDocument: asyncHandler(async (req, res) => {
		const { content, description } = req.body;
		const storage = getStorage();
		const bucket = admin.storage().bucket();

		if (!content || !description) {
			return res.sendJson(400, false, "content or description is required");
		}

		const create = await Document.create({
			content,
			description,
			file: "",
			link: "",
		});

		const docFile =
			`documents/questions/` +
			uuidv4() +
			"-" +
			req.file.originalname.split(" ").join("-");
		const docBuffer = req.file.buffer;

		bucket
			.file(docFile)
			.createWriteStream()
			.end(docBuffer)
			.on("finish", () => {
				getDownloadURL(ref(storage, docFile)).then(async (linkFile) => {
					await Document.update(
						{
							file: docFile,
							link: linkFile,
						},
						{
							where: {
								id: create.id,
							},
						}
					);
				});
			});

		return res.sendJson(201, true, "success create new document");
	}),

	getAllData: asyncHandler(async (req, res) => {
		const data = await Document.findAll();

		return res.sendJson(200, true, "success", data);
	}),

	/**
	 * @desc      Update Document Question
	 * @route     Update /api/v1/document/update/:document_id
	 * @access    Private
	 */
	updateDocument: asyncHandler(async (req, res) => {
		const { document_id } = req.params;
		const { content, description } = req.body;
		const storage = getStorage();
		const bucket = admin.storage().bucket();

		if (!document_id) {
			return res.sendJson(400, false, "document id is required");
		}

		const data = await Document.findOne({
			where: {
				id: document_id,
			},
		});

		if (!data) {
			return res.sendJson(404, false, "data not found");
		}

		if (req.file) {
			if (data.file) {
				deleteObject(ref(storage, data.file));
			}

			const docFile =
				`documents/questions/` +
				uuidv4() +
				"-" +
				req.file.originalname.split(" ").join("-");
			const docBuffer = req.file.buffer;

			bucket
				.file(docFile)
				.createWriteStream()
				.end(docBuffer)
				.on("finish", () => {
					getDownloadURL(ref(storage, docFile)).then(async (linkFile) => {
						await Document.update(
							{
								content,
								description,
								file: docFile,
								link: linkFile,
							},
							{
								where: {
									id: data.id,
								},
							}
						);
					});
				});
		}

		await Document.update(
			{
				content,
				description,
			},
			{
				where: {
					id: document_id,
				},
			}
		);

		return res.sendJson(200, true, "success update");
	}),

	/**
	 * @desc      Delete Document Question
	 * @route     DELETE /api/v1/document/delete/:document_id
	 * @access    Private
	 */
	deleteDocument: asyncHandler(async (req, res) => {
		const { document_id } = req.params;
		const storage = getStorage();

		if (!document_id) {
			return res.sendJson(400, false, "document id is required");
		}

		const search = await Document.findOne({
			where: {
				id: document_id,
			},
		});

		if (!search) {
			return res.sendJson(404, false, "not found");
		}

		deleteObject(ref(storage, search.file));

		await Document.destroy({
			where: {
				id: search.id,
			},
		});

		return res.sendJson(200, true, "success delete");
	}),
};
