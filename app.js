const { getEndpoints } = require("./controllers/endpoint-controller");

const articleRoutes = require("./routes/article-routes");
const commentRoutes = require("./routes/comment-routes");
const topicRoutes = require("./routes/topic-routes");
const userRoutes = require("./routes/user-routes");

const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", getEndpoints);
app.use(articleRoutes);
app.use(commentRoutes);
app.use(topicRoutes);
app.use(userRoutes);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Data not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg === "Data not found") {
    res.status(404).send(err);
  } else if (err.msg === "Bad request") {
    res.status(400).send(err);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "you are wrong" });
});

module.exports = app;
