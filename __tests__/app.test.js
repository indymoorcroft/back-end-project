const seed = require("../db/seeds/seed");
const request = require("supertest");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const app = require("../app");

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
        expect(endpoints).toEqual(
          expect.objectContaining({
            "GET /api": expect.any(Object),
            "GET /api/topics": expect.any(Object),
            "GET /api/articles": expect.any(Object),
          })
        );
      });
  });
});

describe("GET: /api/topics", () => {
  test("200: responds with all of the topics", () => {
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
