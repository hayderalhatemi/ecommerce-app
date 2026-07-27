import request from "supertest";
import app from "../app";
import { connectTestDb, closeTestDb, clearTestDb } from "./testDb";

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await closeTestDb();
});

describe("Auth API", () => {
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  it("registers a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(testUser);

    expect(res.status).toBe(201);
  });

  it("rejects duplicate email registration", async () => {
    await request(app).post("/api/v1/auth/register").send(testUser);

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(testUser);

    expect(res.status).toBe(400);
  });

  it("logs in with correct credentials", async () => {
    await request(app).post("/api/v1/auth/register").send(testUser);

    const res = await request(app).post("/api/v1/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("rejects login with wrong password", async () => {
    await request(app).post("/api/v1/auth/register").send(testUser);

    const res = await request(app).post("/api/v1/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
  });
});