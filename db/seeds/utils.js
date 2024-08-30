const db = require("../../db/connection");
const format = require("pg-format");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkExists = (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1", table, column);
  return db.query(queryStr, [value]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ msg: "Data not found" });
    }
  });
};

exports.checkPage = (id, limit, page) => {
  if (!isNaN(page)) {
    return db
      .query("SELECT * FROM comments WHERE article_id = $1", [id])
      .then(({ rows }) => {
        const pageLimit = Math.ceil(rows.length / limit);
        if (+page > pageLimit) {
          return Promise.reject({ msg: "Data not found" });
        }
      });
  }
};
