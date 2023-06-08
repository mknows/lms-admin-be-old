const asyncHandler = require('express-async-handler');
const { dbUser, dbArticle, dbArticleUser } = require("../models");

module.exports = {
  getArticles: asyncHandler(async (req, res) => {
    const articles = await dbArticle.findAll({});

    const result = await Promise.all(articles.map(async article => {
      const is_like = await dbArticleUser.findOne({
        where: {
          'article_id': article.dataValues.id,
          'user_id': 1,
        }
      })

      return { ...article.dataValues, is_like: is_like ? true : false };
    }))

    return res.status(200).json({ articles: result });
  })
}