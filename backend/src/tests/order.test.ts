import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app";
import User from "../models/user.model";
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

const generateToken = (id: string, role: string) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

const createUser = async (role: "user" | "admin" = "user") => {
  const user = await User.create({
    name: role === "admin" ? "Admin" : "User",
    email: `${role}@example.com`,
    password: "password123",
    role,
  });
  return { user, token: generateToken(user._id.toString(), role) };
};

const testOrder = {
  items: [
    {
      product: "000000000000000000000001",
      name: "Test Product",
      price: 29.99,
      quantity: 2,
      image: "",
    },
  ],
  shippingAddress: {
    address: "123 Test Street",
    city: "Turku",
    postalCode: "20100",
    country: "Finland",
  },
};

describe("Order API", () => {
  it("rejects order creation without a token", async () => {
    const res = await request(app).post("/api/v1/orders").send(testOrder);
    expect(res.status).toBe(401);
  });

  it("creates an order as a logged-in user", async () => {
    const { token } = await createUser("user");

    const res = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${token}`)
      .send(testOrder);

    expect(res.status).toBe(201);
    expect(res.body.totalPrice).toBe(59.98);
  });

  it("gets the logged-in user's own orders", async () => {
    const { token } = await createUser("user");
    await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${token}`)
      .send(testOrder);

    const res = await request(app)
      .get("/api/v1/orders/my-orders")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("rejects non-admin from getting all orders", async () => {
    const { token } = await createUser("user");

    const res = await request(app)
      .get("/api/v1/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it("allows admin to get all orders", async () => {
    const { token: userToken } = await createUser("user");
    await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send(testOrder);

    const { token: adminToken } = await createUser("admin");

    const res = await request(app)
      .get("/api/v1/orders")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("allows admin to update order status", async () => {
    const { token: userToken } = await createUser("user");
    const created = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send(testOrder);

    const { token: adminToken } = await createUser("admin");

    const res = await request(app)
      .put(`/api/v1/orders/${created.body._id}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "shipped" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("shipped");
  });

  it("returns 404 updating status of a non-existent order", async () => {
    const { token: adminToken } = await createUser("admin");

    const res = await request(app)
      .put("/api/v1/orders/000000000000000000000000/status")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "shipped" });

    expect(res.status).toBe(404);
  });
});