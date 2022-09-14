const { Major } = require("../models");

module.exports = {
	/**
	 * @desc      post Major (Tambah Major)
	 * @route     POST /api/v1/major/create
	 * @access    Private
	 */
	postMajor: async (req, res) => {
		try {
			const { major } = req.body;
			if (!major)
				return res.sendJson(400, false, "Some fields is missing.", {});

			const data = await Major.create({
				name: major[0].toUpperCase() + major.slice(1),
			});

			return res.sendJson(
				200,
				true,
				"Create New Major Success.",
				data.dataValues
			);
		} catch (error) {
			console.error(error);
			return res.sendJson(500, false, error.message, {});
		}
	},

	/**
	 * @desc      get Major
	 * @route     GET /api/v1/major
	 * @access    Public
	 */
	getAllMajors: async (req, res) => {
		try {
			const data = await Major.findAll();
			return res.sendJson(200, true, "Search all major successfully.", data);
		} catch (error) {
			console.error(error);
			return res.sendJson(500, false, error.message, null);
		}
	},

	/**
	 * @desc      get one Major
	 * @route     GET /api/v1/major/:id
	 * @access    Public
	 */
	getMajor: async (req, res) => {
		try {
			const id = req.params.id;
			const data = await Major.findOne({
				where: {
					id: id,
				},
			});
			return res.sendJson(200, true, "Search major successfully.", data);
		} catch (error) {
			console.error(error);
			return res.sendJson(500, false, error.message, null);
		}
	},

	/**
	 * @desc      Edit Major (Ubah Major)
	 * @route     PUT /api/v1/major/edit/:majorId
	 * @access    Private
	 */
	editMajor: async (req, res) => {
		try {
			const { majorId } = req.params;
			const { major } = req.body;

			let data = await Major.findOne({
				where: { id: majorId },
			});

			if (!data)
				return res.status(404).json({
					success: false,
					message: "Invalid major_id.",
					data: {},
				});

			data = await Major.update(
				{
					name: major,
				},
				{
					where: { id: majorId },
					returning: true,
					plain: true,
				}
			);

			return res.status(200).json({
				success: true,
				message: `Edit Major with ID ${majorId} successfully.`,
				data: { ...data[1].dataValues },
			});
		} catch (error) {
			console.error(error);
			return res.sendJson(500, false, error.message, {});
		}
	},

	/**
	 * @desc      Delete Major (Hapus Major)
	 * @route     DELETE /api/v1/my-study/majors/remove-major/:majorId
	 * @access    Private
	 */
	removeMajor: async (req, res) => {
		try {
			const { majorId } = req.params;

			let data = await Major.findOne({
				where: { id: majorId },
			});

			if (!data)
				return res.status(404).json({
					success: false,
					message: "Invalid major_id.",
					data: {},
				});

			Major.destroy({
				where: { id: majorId },
			});

			return res.status(200).json({
				success: true,
				message: `Delete Major with ID ${majorId} successfully.`,
				data: {},
			});
		} catch (error) {
			console.error(error);
			return res.sendJson(500, false, error.message, {});
		}
	},
};
