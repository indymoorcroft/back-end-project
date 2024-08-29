const {
  patchCommentVote,
  deleteCommentById,
} = require("../controllers/comment-controllers");

const express = require("express");
const commentRouter = express.Router();

commentRouter.patch("/api/comments/:comment_id", patchCommentVote);

commentRouter.delete("/api/comments/:comment_id", deleteCommentById);

module.exports = commentRouter;
