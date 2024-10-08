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
        expect(articles).toHaveLength(10);
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
              total_count: 13,
            })
          );
        });
      });
  });
  test("200: responds with the number of articles in an array that is in the limit query", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(5);
      });
  });
  test("200: responds with correct articles in an array when given a page query", () => {
    return request(app)
      .get("/api/articles?p=2")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(3);
        expect(articles).toEqual([
          {
            article_id: 8,
            title: "Does Mitch predate civilisation?",
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-04-17T01:08:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
            total_count: 13,
          },
          {
            article_id: 11,
            title: "Am I a cat?",
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-01-15T22:21:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
            total_count: 13,
          },
          {
            article_id: 7,
            title: "Z",
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-01-07T14:08:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
            total_count: 13,
          },
        ]);
      });
  });
  test("200: responds with correct articles in an array when given a limit and a page query", () => {
    return request(app)
      .get("/api/articles?limit=1&p=3")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(1);
        expect(articles).toEqual([
          {
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
            total_count: 13,
          },
        ]);
      });
  });
  test("200: responds with all of the articles sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: responds with all of the articles sorted by the column given", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: responds with all of the articles in the appropriate order when called with the order query", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("200: responds with all of the articles sorted by the column and the order given", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("topic", { descending: false });
      });
  });
  test("200: responds with articles filtered by topic and reduces the total count", () => {
    return request(app)
      .get("/api/articles?topic=mitch&limit=15")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: "mitch",
              total_count: 12,
            })
          );
        });
      });
  });
  test("200: responds with an empty array when the topic exists but has no related articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(0);
        expect(Array.isArray(articles)).toBe(true);
      });
  });
  test("400: responds with an appropriate error message when given an invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("400: responds with an appropriate error message when given an invalid order query", () => {
    return request(app)
      .get("/api/articles?order=invalid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: responds with an appropriate error message when given an invalid topic query", () => {
    return request(app)
      .get("/api/articles?topic=notatopic")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Data not found");
      });
  });
  test("400: responds with an appropriate error message when given an invalid page query", () => {
    return request(app)
      .get("/api/articles?p=notapage")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("400: responds with an appropriate error message when given an invalid limit query", () => {
    return request(app)
      .get("/api/articles?limit=notalimit")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: responds with an appropriate error message when given a valid page query that does not have data", () => {
    return request(app)
      .get("/api/articles?p=99")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Data not found");
      });
  });
});

describe("GET: /api/users", () => {
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

describe("GET: /api/users/:username", () => {
  test("responds with the username object that matches the given username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual(
          expect.objectContaining({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          })
        );
      });
  });
  test("404: sends an appropriate status and error message when given a valid but non-existent username", () => {
    return request(app)
      .get("/api/users/not_a_username")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Data not found");
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
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("404: sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Data not found");
      });
  });
  test("400: responds with an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
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
  test("200: responds with the comments limited to 10 by default", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(10);
      });
  });
  test("200: responds with the comments limited by the number passed into the limit query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(5);
      });
  });
  test("200: responds with the comments on the second page when passed a page query", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(1);
        expect(comments).toEqual([
          {
            comment_id: 9,
            body: "Superficially charming",
            article_id: 1,
            author: "icellusedkars",
            votes: 0,
            created_at: "2020-01-01T03:08:00.000Z",
          },
        ]);
      });
  });
  test("404: sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Data not found");
      });
  });
  test("400: responds with an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("400: responds with an appropriate error message when given an invalid page query", () => {
    return request(app)
      .get("/api/articles/1/comments?p=notapage")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("400: responds with an appropriate error message when given an invalid limit query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=notalimit")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: responds with an appropriate error message when given a valid page query that does not have data", () => {
    return request(app)
      .get("/api/articles/1/comments?p=3")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Data not found");
      });
  });
});

describe("POST: /api/topics", () => {
  test("201: adds a new topic and responds with the newly created topic object", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "mugs",
        description: "a little bit tea-dious",
      })
      .then(({ body: { topic } }) => {
        expect(topic).toEqual({
          slug: "mugs",
          description: "a little bit tea-dious",
        });
      });
  });
  test("400: responds with an appropriate status and error message when provided without a slug", () => {
    return request(app)
      .post("/api/topics")
      .send({
        description: "a little bit tea-dious",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("POST: /api/articles", () => {
  test("201: adds a new article and responds with the newly created article object", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "rogersop",
        title: "There's a new moewvelous cat in town!",
        body: "Her name is Melor. She like belly scratches and St Luke's Garden",
        topic: "cats",
        article_img_url:
          "https://www.istockphoto.com/photo/close-up-portrait-of-black-cat-gm1616213783-531307336",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            author: "rogersop",
            title: "There's a new moewvelous cat in town!",
            body: "Her name is Melor. She like belly scratches and St Luke's Garden",
            topic: "cats",
            article_img_url:
              "https://www.istockphoto.com/photo/close-up-portrait-of-black-cat-gm1616213783-531307336",
            article_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          })
        );
      });
  });
  test("400: responds with an appropriate status and error message when provided without a body", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "rogersop",
        title: "There's a new moewvelous cat in town!",
        topic: "cats",
        article_img_url:
          "https://www.istockphoto.com/photo/close-up-portrait-of-black-cat-gm1616213783-531307336",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: responds with the appropriate status and error message when given a author that does not exist", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "idontexist",
        title: "I cannot write an article without having a username!",
        body: "This should definitely not be allowed. Please cause an error",
        topic: "cats",
        article_img_url:
          "https://www.istockphoto.com/photo/close-up-portrait-of-black-cat-gm1616213783-531307336",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Data not found");
      });
  });
});

describe("POST: /api/articles/:article_id/comments", () => {
  test("201: adds a comment for an article and responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .send({
        username: "icellusedkars",
        body: "Hit me up if you wanna sell your wheelz",
      })
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
        expect(msg).toBe("Bad request");
      });
  });
  test("400: responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .post("/api/articles/not-an-id/comments")
      .send({
        username: "icellusedkars",
        body: "Hit me up if you wanna sell your wheelz",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: responds with an appropriate status and error message when given a non-existent id", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({
        username: "icellusedkars",
        body: "Hit me up if you wanna sell your wheelz",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Data not found");
      });
  });
  test("404: responds with the appropriate status and error message when given a username that does not exist", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .send({
        username: "idontexist",
        body: "I should not be adding a comment without an account",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Data not found");
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
        expect(msg).toBe("Bad request");
      });
  });
  test("400: responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .patch("/api/articles/not-an-id")
      .send({
        inc_votes: 1,
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: responds with an appropriate status and error message when given a non-existent id", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({
        inc_votes: 1,
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Data not found");
      });
  });
});

describe("PATCH: /api/comments/:comment_id", () => {
  test("200: updates the votes on a comment when given the comment id", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({
        inc_votes: 1,
      })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            votes: 17,
          })
        );
      });
  });
  test("400: responds with an appropriate status and error message when provided with the wrong data type", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({
        inc_votes: "not a number",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("400: responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .patch("/api/comments/not-an-id")
      .send({
        inc_votes: 1,
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: responds with an appropriate status and error message when given a non-existent id", () => {
    return request(app)
      .patch("/api/comments/999")
      .send({
        inc_votes: 1,
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Data not found");
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
        expect(msg).toBe("Data not found");
      });
  });
  test("400: responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("DELETE: /api/articles/:article_id", () => {
  test("204: deletes the specified article and its respective comments based on id and sends no body back", () => {
    return request(app).delete("/api/articles/1").expect(204);
  });
  test("404: responds with an appropriate status and error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Data not found");
      });
  });
  test("400: responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/articles/not-an-id")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});
