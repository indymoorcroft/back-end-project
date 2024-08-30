const {
  selectCommentsById,
  createNewComment,
  updateArticleVote,
  removeCommentById,
} = require("../models/comment-models");

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  selectCommentsById(article_id, limit, p)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;
  createNewComment(body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentVote = (req, res, next) => {
  const { body } = req;
  const { comment_id } = req.params;
  updateArticleVote(body, comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
