const { getTopics } = require("./controllers/topic-controllers");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "you are wrong" });
});

module.exports = app;
