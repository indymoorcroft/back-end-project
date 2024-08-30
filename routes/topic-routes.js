const { getTopics, postTopic } = require("../controllers/topic-controllers");

const express = require("express");
const topicRouter = express.Router();

topicRouter.get("/api/topics", getTopics);

topicRouter.post("/api/topics", postTopic);

module.exports = topicRouter;
