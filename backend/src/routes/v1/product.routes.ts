import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../../controllers/product.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import upload from "../../middlewares/upload.middleware";
import validate from "../../middlewares/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../../schemas/product.schema";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin only routes
router.post(
  "/",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  validate(createProductSchema),
  createProduct,
);
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  validate(updateProductSchema),
  updateProduct,
);
router.delete("/:id", protect, restrictTo("admin"), deleteProduct);

export default router;
