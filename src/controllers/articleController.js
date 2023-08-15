const { Article } = require("../models");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const {
	getStorage,
	ref,
	getDownloadURL,
	deleteObject,
} = require("firebase/storage");
const asyncHandler = require("express-async-handler");
const { redisClient } = require("../helpers/redis");
const pagination = require("../helpers/pagination");
const { Op } = require("sequelize");
const { dbUser, dbArticle, dbArticleUser } = require("../models");

const levenshtein = require("js-levenshtein");

module.exports = {
	getArticleUsingLevenshteinDistance: asyncHandler(async (req, res) => {
		const { search } = req.query;

		await Article.findAll({
			where: {
				title: {
					[Op.ne]: null, // Filter judul artikel yang tidak null
				},
			},
			order: [["created_at", "desc"]],
		})
			.then((articles) => {
				const titles = articles.map((article) => article.title.trim());

				const hardResults = titles.map((title) => {
					const distances = [];
					const titlesSplit = title.split(" ");
					const searchsSplit = search.split(" ");

					titlesSplit.forEach((titleWord) => {
						searchsSplit.forEach((searchWord) => {
							distances.push(levenshtein(titleWord, searchWord));
						});
					});

					distances.sort((a, b) => a - b);

					return { title, distance: distances };
				});

				let results = hardResults.map(({ title, distance }) => ({
					title,
					lowest_distance: Math.min(...distance),
					total_distance: distance.reduce((total, number) => total + number, 0),
				}));

				results = results.sort((a, b) => {
					if (a.lowest_distance === b.lowest_distance) {
						return a.total_distance - b.total_distance;
					} else {
						return a.lowest_distance - b.lowest_distance;
					}
				});

				res.sendJson(200, true, "Hello", { nearest: [...results] });
			})
			.catch((error) => {
				console.error("Terjadi kesalahan:", error);
				res.sendJson(500, false, "Terjadi kesalahan");
			});
	}),

	/**
	 * @desc      Get All data Article
	 * @route     GET /api/v1/article/index?page=(number)&limit=(number)&search=(str)
	 * @access    Private
	 */
	index: asyncHandler(async (req, res) => {
		let results;
		const { page, limit, search } = req.query;
		let search_query = "%%";

		if (search) {
			search_query = "%" + search.charAt(0) + "%";
		}

		results = await Article.findAll({
			attributes: {
				include: ["created_at"],
			},
			order: [["created_at", "desc"]],
		});

		const length = results.length;
		var index = 0;
		const regExpConstructor = new RegExp(search, "i");
		for (let i = 0; i < length; i++) {
			if (results[index].title.search(regExpConstructor) === -1) {
				results.splice(index, 1);
			} else {
				index++;
			}
		}

		results = await pagination(results, page, limit);

		if (results.length == 0) {
			return res.sendJson(200, true, "success get, but no article is found");
		} else {
			return res.sendJson(200, true, "success get all data", results);
		}
	}),

	/**
	 * @desc      Get data Article by id
	 * @route     GET /api/v1/article/:id
	 * @access    Private
	 */
	getArticleById: asyncHandler(async (req, res) => {
		const { id } = req.params;

		const data = await Article.findOne({
			attributes: {
				include: ["created_at"],
			},
			where: {
				id,
			},
		});

		if (!data) {
			return res.sendJson(404, false, "article id not found", null);
		}

		return res.sendJson(200, true, "suceess get data article by id", data);
	}),

	/**
	 * @desc      Create a new data article
	 * @route     POST /api/v1/article/create
	 * @access    Private
	 */
	create: asyncHandler(async (req, res) => {
		const { title, description } = req.body;
		const bucket = admin.storage().bucket();

		const articleFile =
			uuidv4() + "-" + req.file.originalname.split(" ").join("-");
		const articleBuffer = req.file.buffer;

		const created = await Article.create({
			title,
			description,
		});

		bucket
			.file(`images/article/${articleFile}`)
			.createWriteStream()
			.end(articleBuffer)
			.on("finish", () => {
				firebaseLinkFileArticle(
					`images/article/${articleFile}`,
					articleFile,
					created.id
				);
			});

		return res.sendJson(201, true, "success create new article", {
			created,
		});
	}),

	/**
	 * @desc      Update data article
	 * @route     PUT /api/v1/article/update
	 * @access    Private
	 */
	update: asyncHandler(async (req, res) => {
		const { title, description } = req.body;
		const { uuid } = req.params;
		const storage = getStorage();
		const bucket = admin.storage().bucket();

		const findFile = await Article.findOne({
			where: {
				id: uuid,
			},
		});

		if (req.file) {
			if (findFile == null) {
				return res.sendJson(400, false, "can't find article");
			}

			deleteObject(ref(storage, findFile.image));

			const articleUpdateFile =
				uuidv4() + "-" + req.file.originalname.split(" ").join("-");
			const articleUpdateBuffer = req.file.buffer;

			bucket
				.file(`images/article/${articleUpdateFile}`)
				.createWriteStream()
				.end(articleUpdateBuffer);

			await Article.update(
				{
					image: `images/article/${articleUpdateFile}`,
				},
				{
					where: {
						id: uuid,
					},
				}
			);
		}

		if (findFile == null) {
			return res.sendJson(400, false, "can't find article");
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
				"can't update because there no have value article"
			);
		}
		return res.sendJson(200, true, "succes update article");
	}),

	/**
	 * @desc      Delete data article
	 * @route     DELETE /api/v1/article/delete/:id
	 * @access    Private
	 */
	delete: asyncHandler(async (req, res) => {
		const { id } = req.params;
		const storage = getStorage();

		const findArticle = await Article.findOne({
			where: {
				id,
			},
		});

		if (findArticle == null) {
			return res.sendJson(404, false, "article not found");
		}

		deleteObject(ref(storage, findArticle.image));
		await Article.destroy({
			where: {
				id,
			},
		});

		return res.sendJson(200, true, "success delete article");
	}),
	// FROM _articleController
	getArticlesUnder: asyncHandler(async (req, res) => {
		const articles = await dbArticle.findAll({});

		const result = await Promise.all(
			articles.map(async (article) => {
				const is_like = await dbArticleUser.findOne({
					where: {
						article_id: article.dataValues.id,
						user_id: 1,
					},
				});

				return { ...article.dataValues, is_like: is_like ? true : false };
			})
		);

		return res.status(200).json({ articles: result });
	}),
};

const firebaseLinkFileArticle = (image, file, id) => {
	const storage = getStorage();
	getDownloadURL(ref(storage, `images/article/${file}`)).then(
		async (linkFile) => {
			await Article.update(
				{
					image: image,
					image_link: linkFile,
				},
				{
					where: {
						id,
					},
				}
			);
		}
	);
};

const sleep = (ms) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};
