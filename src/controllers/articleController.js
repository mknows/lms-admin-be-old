const { Article } = require("../models");
const fs = require("fs");

module.exports = {
	/**
	 * @desc      Get All data Article
	 * @route     GET /api/v1/article/index
	 * @access    Private
	 */
	index: async (req, res) => {
		try {
			const data = await Article.findAll();
			console.log(data);

			return res.sendJson(200, true, "success get all data", data);
		} catch (error) {
			console.log(error);
			return res.sendJson(403, false, error, {});
		}
	},

	/**
	 * @desc      Create a new data article
	 * @route     POST /api/v1/article/create
	 * @access    Private
	 */
	create: async (req, res) => {
		try {
			const { title, description } = req.body;

			const created = await Article.create({
				title,
				description,
				image: req.file.filename,
			});

			return res.sendJson(201, true, "success create new article", {
				title: created.title,
				description: created.description,
				image: created.image,
			});
		} catch (error) {
			console.log(error);
			return res.sendJson(403, false, error, {});
		}
	},

	/**
	 * @desc      Update data article
	 * @route     PUT /api/v1/article/update
	 * @access    Private
	 */
	update: async (req, res) => {
		try {
			const { title, description } = req.body;
			const uuid = req.params.uuid;

			if (req.file) {
        const findFile = await Article.findOne({
          where:{
            id: uuid
          }
        })

        fs.unlinkSync("./public/images/"+findFile.image)

				await Article.update(
					{
						image: req.file.filename,
					},
					{
						where: {
							id: uuid,
						},
					}
				);
			}

			const updated = await Article.update(
				{
					title,
					description,
				},
				{
					where: {
						id: uuid,
					},
				}
			);

			if (updated == 0) {
				return res.sendJson(
					204,
					false,
					"can't update because there no have value article",
					{}
				);
			}
			return res.sendJson(200, true, "succes update article", {});
		} catch (error) {
			console.log(error);
			return res.sendJson(403, false, error, {});
		}
	},
};
