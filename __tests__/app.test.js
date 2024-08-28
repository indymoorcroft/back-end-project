const seed = require("../db/seeds/seed");
const request = require("supertest");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const app = require("../app");
const endpointsJSON = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET: /api", () => {
  test("200: responds with all the available endpoints of the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJSON);
      });
  });
});

describe("GET: /api/topics", () => {
  test("200: responds with all of the topicsin an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET: /api/articles", () => {
  test("200: responds with all of the articles in an array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: responds with all of the articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET: api/users", () => {
  test("200: responds with all of the users in an array", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET: /api/articles/:article_id", () => {
  test("200: responds with article object that matches the given id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          })
        );
      });
  });
  test("404: sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
  test("400: responds with an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
      });
  });
  test("404: sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
  test("400: responds with an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("200: article_id exists by has no related comments, responds with an empty array", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(0);
        expect(Array.isArray(comments)).toBe(true);
      });
  });
  test("200: responds with all of the comments sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("POST: /api/articles/:article_id/comments", () => {
  test("201: adds a comment for an article and responds with the posted comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Hit me up if you wanna sell your wheelz",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "Hit me up if you wanna sell your wheelz",
            article_id: 9,
            author: "icellusedkars",
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("400: responds with an appropriate status and error message when provided without a body", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .send({
        username: "icellusedkars",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  test("200: updates the article vote value based on the article id", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 1,
      })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            votes: 101,
          })
        );
      });
  });
  test("400: responds with an appropriate status and error message when provided with the wrong data type", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: "not a number",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  test("204: deletes the specified comment and sends no body back", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: responds with an appropriate status and error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment not found");
      });
  });
  test("400: responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});
