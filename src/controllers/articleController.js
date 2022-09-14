const { Article } = require("../models");
const fs = require("fs");

module.exports = {
	index: async (req, res) => {
		try {
			const data = await Article.findAll();
			return res.sendJson(200, true, "success get all data", data);
		} catch (error) {
			console.log(error);
			return res.sendJson(403, false, error, {});
		}
	},

	create: async (req, res) => {
		try {
			const { title, description } = req.body;

			const created = await Article.create({
				title,
				description,
				image: Date.now() + "-" + req.file.originalname.split(" ").join("-"),
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

	update: async (req, res) => {
		try {
			const { title, description } = req.body;
			const uuid = req.params.uuid;

			if (req.file) {
				const findFile = await Article.findOne({
					where: {
						uuid,
					},
				});

				fs.unlinkSync(findFile.image);
			}

			const updated = await Article.update(
				{
					title,
					description,
					image: Date.now() + "-" + req.file.originalname.split(" ").join("-"),
				},
				{
					where: {
						uuid,
					},
				}
			);

			return res.sendJson(200, true, "succes update user", updated);
		} catch (error) {
			console.log(error);
			return res.sendJson(403, false, error, {});
		}
	},
};
