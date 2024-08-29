const { getTopics } = require("../controllers/topic-controllers");

const express = require("express");
const topicRouter = express.Router();

topicRouter.get("/api/topics", getTopics);

module.exports = topicRouter;
