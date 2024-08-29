const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.selectAllArticles = (sort_by = "created_at", order, topic) => {
  const validSortBys = [
    "title",
    "topic",
    "author",
    "created_at",
    "article_img_url",
    "comment_count",
  ];

  if (!validSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryStr =
    "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id";

  const queryVals = [];
  const queryProms = [];

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryVals.push(topic);
    queryProms.push(checkExists("articles", "topic", topic));
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by}`;

  if (order === "asc") {
    queryStr += " ASC";
  } else if (order === "desc" || order === undefined) {
    queryStr += " DESC";
  } else {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  queryProms.push(db.query(queryStr, queryVals));

  return Promise.all(queryProms).then((results) => {
    if (results.length === 1) {
      return results[0].rows;
    } else {
      return results[1].rows;
    }
  });
};

exports.selectArticleById = (id) => {
  return db
    .query(
      "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id",
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Data not found" });
      } else {
        return rows[0];
      }
    });
};

exports.updateArticleVote = (body, id) => {
  const voteChange = Object.values(body)[0];
  return db
    .query(
      "UPDATE articles SET votes = $1 + votes WHERE article_id = $2 RETURNING *",
      [voteChange, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Data not found" });
      } else {
        return rows[0];
      }
    });
};
