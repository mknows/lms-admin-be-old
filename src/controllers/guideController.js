const { Guide, Glossary } = require("../models");
const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const pagination = require("../helpers/pagination");

module.exports = {
	/**
	 * @desc      Get All Guide by Type
	 * @route     GET /api/v1/getbytype?type="(video/book)"
	 * @access    Public
	 */
	getAllGuideByType: asyncHandler(async (req, res) => {
		const { type } = req.query;
		if (!["video", "book"].includes(type)) {
			return res.sendJson(400, false, "Invalid Type", {});
		}
		const guides = await Guide.findAll({
			where: {
				type,
			},
		});
		return res.sendJson(200, true, "Success", guides);
	}),
	/**
	 * @desc      Get Guide by ID
	 * @route     GET /api/v1/guide/:id
	 * @access    Public
	 */
	getGuideByID: asyncHandler(async (req, res) => {
		const { id } = req.params;
		if (!id) {
			return res.sendJson(400, false, "ID is invalid", {});
		}
		let guides = await Guide.findOne({
			where: {
				id,
			},
		});
		return res.sendJson(200, true, "Success", guides);
	}),
	/**
	 * @desc      Get all glossary words
	 * @route     GET /api/v1/guide/glossary?page=(number)&limit=(number)&search=(str)
	 * @access    Public
	 */
	getAllGlossaries: asyncHandler(async (req, res) => {
		let { page, limit, search, type } = req.query;

		let search_query = "%%";

		if (search) {
			search_query = "%" + search + "%";
		}

		if (!type) {
			type = ["application", "material"];
		}
		let glossaries = await Glossary.findAll({
			attributes: ["id", "word", "definition"],
			where: {
				word: { [Op.iLike]: search_query },
				type,
			},
		});
		glossaries = await pagination(glossaries, page, limit);
		return res.sendJson(200, true, "Success", glossaries);
	}),
	/**
	 * @desc      Get glossary by ID
	 * @route     GET /api/v1/guide/glossary/:id
	 * @access    Public
	 */
	getGlossaryByID: asyncHandler(async (req, res) => {
		const { id } = req.params;
		if (!id) {
			return res.sendJson(400, false, "ID is invalid", {});
		}
		let glossary = await Glossary.findOne({
			where: {
				id,
			},
		});
		return res.sendJson(200, true, "Success", glossary);
	}),
};
