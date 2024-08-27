const { getEndpoints } = require("./controllers/endpoint-controller");
const { getTopics } = require("./controllers/topic-controllers");
const {
  getArticles,
  getArticleById,
} = require("./controllers/article-controllers");
const { getCommentsById } = require("./controllers/comment-controllers");

const express = require("express");
const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg === "Invalid Request") {
    res.status(404).send(err);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "you are wrong" });
});

module.exports = app;
