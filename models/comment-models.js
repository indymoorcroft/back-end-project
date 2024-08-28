const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.selectCommentsById = (id) => {
  let queryStr =
    "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC";
  const queryProms = [];

  queryProms.push(checkExists("articles", "article_id", id));
  queryProms.push(db.query(queryStr, [id]));

  return Promise.all(queryProms).then((results) => {
    if (results.length === 1) {
      return results[0].rows;
    } else {
      return results[1].rows;
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

exports.removeCommentById = (id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Data not found" });
      }
    });
};
