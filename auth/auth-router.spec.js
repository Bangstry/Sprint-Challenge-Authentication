const request = require("supertest");
const db = require("../database/dbConfig.js");
const Users = require("./users-model.js");
const server = require("../api/server.js");

describe("auth-router", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  describe("POST /register", () => {
    it("should return JSON", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({ username: "roman", password: "roman123" })
          .then(res => {
            expect(res.type).toMatch(/json/i);
          });
    });

    it("expect 201", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({ username: "roman", password: "roman123" })
          .then(res => {
            expect(res.status).toBe(201);
          });
    });
  });

  describe("POST /login", () => {
    it("expect 401 with no token", async () => {
      await Users.add({ username: "tyler", password: "tyler123" });

      await request(server)
        .post("/api/auth/login")
        .send({ username: "tyler", password: "tyler123" })
        .then(res => {
          expect(res.status).toBe(401);
        });
    });

    it("should return JSON", async () => {
      await Users.add({ username: "nottyler", password: "tyler123" });

      await request(server)
        .post("/api/auth/login")
        .send({ username: "nottyler", password: "tyler123" })
        .then(res => {
          expect(res.type).toMatch(/json/i);
        });
    });
  });
});