const asyncHandler = require("express-async-handler");
const { Preview } = require("../models");
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
	 * @desc      create preview
	 * @route     POST /api/v1/preview/create
	 * @access    Public
	 */
	createPreview: asyncHandler(async (req, res) => {
		const { description } = req.body;

		const storage = getStorage();
		const bucket = admin.storage().bucket();

		const originalname = req.file.originalname;
		const previewFile =
			"images/preview/" +
			uuidv4() +
			"-" +
			req.file.originalname.split(" ").join("_");
		const priviewFileBuffer = req.file.buffer;

		bucket
			.file(previewFile)
			.createWriteStream()
			.end(priviewFileBuffer)
			.on("finish", () => {
				getDownloadURL(ref(storage, previewFile))
					.then(async (linkFile) => {
						const data = await Preview.create({
							original_name: originalname,
							name: previewFile,
							url: linkFile,
							description: description,
						});

						return res.sendJson(201, true, "success create preview", data);
					})
					.catch((err) => {
						console.log(err.message);
					});
			});
	}),

	/**
	 * @desc      get all proview
	 * @route     GET /api/v1/preview/
	 * @access    Public
	 */
	getAllPreview: asyncHandler(async (req, res) => {
		const previews = await Preview.findAll();
		return res.status(200).json({
			success: true,
			message: "All previews",
			data: previews,
		});
	}),
};
