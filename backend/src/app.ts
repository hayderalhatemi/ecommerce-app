import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import connectDB from "./config/db";
import errorHandler from "./middlewares/error.middleware";
import authRoutes from "./routes/v1/auth.routes";
import orderRoutes from "./routes/v1/order.routes";
import productRoutes from "./routes/v1/product.routes";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();
connectDB();

const app = express();

app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 *1000, // minutes
  max: 100,
  message: { message: "Too many requests, please try again later."},
}));

app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// v1 routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
// Error handler must be last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
