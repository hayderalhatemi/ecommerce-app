import dotenv from "dotenv";

dotenv.config();

import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app";
import User from "../models/user.model";
import { clearTestDb, closeTestDb, connectTestDb } from "./testDb";

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

const createAdmin = async () => {
  const admin = await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  });
  return generateToken(admin._id.toString(), "admin");
};

const testProduct = {
  name: "Test Product",
  description: "A product used for testing purposes",
  price: 29.99,
  category: "Electronics",
  stock: 10,
};

describe("Product API", () => {
  it("gets all products (public)", async () => {
    const res = await request(app).get("/api/v1/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("rejects product creation without a token", async () => {
    const res = await request(app).post("/api/v1/products").send(testProduct);
    expect(res.status).toBe(401);
  });

  it("creates a product as admin", async () => {
    const token = await createAdmin();

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${token}`)
      .field("name", testProduct.name)
      .field("description", testProduct.description)
      .field("price", testProduct.price)
      .field("category", testProduct.category)
      .field("stock", testProduct.stock);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe(testProduct.name);
  });

  it("gets a product by id", async () => {
    const token = await createAdmin();
    const created = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${token}`)
      .field("name", testProduct.name)
      .field("description", testProduct.description)
      .field("price", testProduct.price)
      .field("category", testProduct.category)
      .field("stock", testProduct.stock);

    const res = await request(app).get(`/api/v1/products/${created.body._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(created.body._id);
  });

  it("returns 404 for a non-existent product", async () => {
    const res = await request(app).get(
      "/api/v1/products/000000000000000000000000",
    );
    expect(res.status).toBe(404);
  });

  it("updates a product as admin", async () => {
    const token = await createAdmin();
    const created = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${token}`)
      .field("name", testProduct.name)
      .field("description", testProduct.description)
      .field("price", testProduct.price)
      .field("category", testProduct.category)
      .field("stock", testProduct.stock);

    const res = await request(app)
      .put(`/api/v1/products/${created.body._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 49.99 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(49.99);
  });

  it("deletes a product as admin", async () => {
    const token = await createAdmin();
    const created = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${token}`)
      .field("name", testProduct.name)
      .field("description", testProduct.description)
      .field("price", testProduct.price)
      .field("category", testProduct.category)
      .field("stock", testProduct.stock);

    const res = await request(app)
      .delete(`/api/v1/products/${created.body._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
