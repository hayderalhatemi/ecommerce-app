import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../../controllers/product.controller';
import { protect, restrictTo } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate.middleware';
import { createProductSchema, updateProductSchema } from '../../schemas/product.schema';
import upload from '../../middlewares/upload.middleware';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);