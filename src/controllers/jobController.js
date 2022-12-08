const { Job, Company, StudentJob } = require("../models");
const asyncHandler = require("express-async-handler");
const pagination = require("../helpers/pagination");
const { Op } = require("sequelize");

module.exports = {
	/**
	 * @desc      Get all jobs
	 * @route     GET /api/v1/jobs/getall?page=(number)&limit=(number)&position=(str)&name=(str)&location=(str)
	 * @access    Private
	 **/
	getAllJobs: asyncHandler(async (req, res) => {
		const { page, limit, position, name, location } = req.query;
		let { type } = req.body;
		let available_type = [
			"internship",
			"project",
			"part time job",
			"full time job",
		];
		if (!type) {
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
		if (search_position) {
			search_position_query = "%" + position + "%";
		}
		if (search_company) {
			search_company_query = "%" + name + "%";
		}
		if (location) {
			location_query = "%" + location + "%";
		}

		let jobs = await Job.findAll({
			where: {
				position: { [Op.iLike]: search_position_query },
				type,
			},
			include: {
				model: Company,
				where: {
					company_name: { [Op.iLike]: search_company_query },
					location: { [Op.iLike]: location_query },
				},
			},
		});

		jobs = await pagination(jobs, page, limit);

		return res.sendJson(200, true, "Success", jobs);
	}),
	/**
	 * @desc      Take job
	 * @route     POST /api/v1/job/apply/:job_id
	 * @access    Private
	 **/
	takeJob: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const { job_id } = req.params;

		if (!student_id) {
			return res.sendJson(400, false, "Student is unidentified");
		}
		if (!job_id) {
			return res.sendJson(400, false, "Job id not found");
		}
		const job = await StudentJob.findOne({
			where: {
				student_id,
				job_id,
			},
		});
		if (job) {
			return res.sendJson(400, false, "Student has taken this job");
		}
		const take_job = await StudentJob.create({
			student_id,
			job_id,
			status: "PENDING",
		});

		delete take_job.dataValues["deleted_at"];
		delete take_job.dataValues["created_at"];
		delete take_job.dataValues["updated_at"];
		delete take_job.dataValues["created_by"];
		delete take_job.dataValues["updated_by"];

		return res.sendJson(200, true, "Success", take_job);
	}),
	/**
	 * @desc      Get all Pending or Ongoing Job
	 * @route     POST /api/v1/job/student
	 * @access    Private
	 **/
	getAllStudentJob: asyncHandler(async (req, res) => {
		const student_id = req.student_id;

		if (!student_id) {
			return res.sendJson(400, false, "Student is unidentified");
		}

		const student_job = await StudentJob.findAll({
			where: {
				student_id,
			},
		});

		return res.sendJson(200, true, "Success", student_job);
	}),
};
