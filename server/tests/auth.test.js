const request = require("supertest");
const express = require("express");

const app = express();

app.use(express.json());

app.get("/protected", (req, res) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  res.status(200).json({
    message: "Authorized",
  });
});

describe("Protected Route Test", () => {
  test("Should deny access without token", async () => {
    const response = await request(app).get("/protected");

    expect(response.statusCode).toBe(401);

    expect(response.body.message).toBe("Unauthorized");
  });

  test("Should allow access with token", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer testtoken");

    expect(response.statusCode).toBe(200);

    expect(response.body.message).toBe("Authorized");
  });
});
