const db = require("../db/connection");
const { checkExists, checkPage } = require("../db/seeds/utils");

exports.selectCommentsById = (id, limit = 10, p) => {
  if (p !== undefined && isNaN(+p)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryStr =
    "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC LIMIT $2";
  const queryVals = [];
  queryVals.push(id, limit);

  const queryProms = [];
  queryProms.push(checkPage(id, limit, p));
  queryProms.push(checkExists("articles", "article_id", id));

  if (p) {
    queryStr += ` OFFSET $3`;
    p = +limit * (+p - 1);
    queryVals.push(p);
  }

  queryProms.push(db.query(queryStr, queryVals));

  return Promise.all(queryProms).then((results) => {
    if (results.length === 1) {
      return results[0].rows;
    } else {
      return results[2].rows;
    }
  });
};

exports.createNewComment = (comment, id) => {
  const { username, body } = comment;
  return db
    .query(
      `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *`,
      [body, id, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticleVote = (body, id) => {
  const voteChange = Object.values(body)[0];
  return db
    .query(
      "UPDATE comments SET votes = $1 + votes WHERE comment_id = $2 RETURNING *",
      [voteChange, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Data not found" });
      }
      return rows[0];
    });
};

exports.removeCommentById = (id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Data not found" });
      }
    });
};
