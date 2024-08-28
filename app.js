const { getEndpoints } = require("./controllers/endpoint-controller");
const { getTopics } = require("./controllers/topic-controllers");
const {
  getArticles,
  getArticleById,
  patchArticleVote,
} = require("./controllers/article-controllers");
const {
  getCommentsById,
  postComment,
  deleteCommentById,
} = require("./controllers/comment-controllers");
const { getUsers } = require("./controllers/user-controllers");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVote);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Data not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg === "Article not found" || err.msg === "Comment not found") {
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
