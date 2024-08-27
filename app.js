const { getEndpoints } = require("./controllers/endpoint-controller");
const {
  getTopics,
  getArticleById,
} = require("./controllers/topic-controllers");

const express = require("express");
const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

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
