const {
  getArticles,
  getArticleById,
  postArticle,
  patchArticleVote,
  deleteArticleById,
} = require("../controllers/article-controllers");
const {
  getCommentsById,
  postComment,
} = require("../controllers/comment-controllers");

const express = require("express");
const articleRouter = express.Router();

articleRouter.get("/api/articles", getArticles);

articleRouter.get("/api/articles/:article_id", getArticleById);

articleRouter.get("/api/articles/:article_id/comments", getCommentsById);

articleRouter.post("/api/articles", postArticle);

articleRouter.post("/api/articles/:article_id/comments", postComment);

articleRouter.patch("/api/articles/:article_id", patchArticleVote);

articleRouter.delete("/api/articles/:article_id", deleteArticleById);

module.exports = articleRouter;
