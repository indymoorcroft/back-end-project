const {
  selectAllArticles,
  selectArticleById,
  createArticle,
  updateArticleVote,
} = require("../models/article-models");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, p } = req.query;
  selectAllArticles(sort_by, order, topic, limit, p)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const { body } = req;
  createArticle(body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVote = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;
  updateArticleVote(body, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
