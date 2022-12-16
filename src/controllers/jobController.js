const { Job, Company } = require("../models");
const asyncHandler = require("express-async-handler");
const pagination = require("../helpers/pagination");
const { Op } = require("sequelize");

module.exports = {
	/**
	 * @desc      Get all jobs
	 * @route     GET /api/v1/jobs/getall?page=(number)&limit=(number)&position=(str)&name=(str)&location=(str)&
	 * @access    Private
	 **/
	getAllJobs: asyncHandler(async (req, res) => {
		let { page, limit, position, name, location, partnered } = req.query;
		let { type } = req.body;

		partnered = partnered ? partnered : [true, false];
		let available_type = ["finance", "sponsored", "design", "programming"];
		if (!type || type.length === 0) {
			type = available_type;
		}
		let wrong_type = type.filter((x) => !available_type.includes(x));
		if (wrong_type.length !== 0) {
			return res.sendJson(
				400,
				true,
				`Type is not included.(${wrong_type})`,
				{}
			);
		}

		let search_company_query = "%%",
			search_position_query = "%%",
			location_query = "%%";
		if (position) {
			search_position_query = "%" + position + "%";
		}
		if (name) {
			search_company_query = "%" + name + "%";
		}
		if (location) {
			location_query = "%" + location + "%";
		}
		let jobs = await Job.findAll({
			attributes: ["position", "salary", "id"],
			where: {
				position: { [Op.iLike]: search_position_query },
				type,
			},
			include: {
				model: Company,
				attributes: ["company_name", "location", "company_logo"],
				where: {
					company_name: { [Op.iLike]: search_company_query },
					location: { [Op.iLike]: location_query },
					partnered,
				},
			},
		});

		jobs = await pagination(jobs, page, limit);

		return res.sendJson(200, true, "Success", jobs);
	}),
	/**
	 * @desc      Get one job
	 * @route     GET /api/v1/jobs/job/:id
	 * @access    Private
	 **/
	getJob: asyncHandler(async (req, res) => {
		const { id } = req.params;
		const job = await Job.findOne({
			where: {
				id,
			},
			include: {
				model: Company,
			},
		});
		return res.sendJson(200, true, "Success", job);
	}),
};
