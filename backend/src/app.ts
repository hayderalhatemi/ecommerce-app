import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import errorHandler from "./middlewares/error.middleware";
import authRoutes from "./routes/v1/auth.routes";
import orderRoutes from "./routes/v1/order.routes";
import productRoutes from "./routes/v1/product.routes";

dotenv.config();

const app = express();

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // minutes
    max: 100,
    message: { message: "Too many requests, please try again later." },
  }),
);

app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// v1 routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
// Error handler must be last middleware
app.use(errorHandler);

export default app;
