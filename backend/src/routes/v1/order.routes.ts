import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../../controllers/order.controller';
import { protect, restrictTo } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate.middleware';
import { createOrderSchema } from '../../schemas/order.schema';

const router = Router();

// User routes
router.post('/', protect, validate(createOrderSchema), createOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin only routes
router.get('/', protect, restrictTo('admin'), getAllOrders);
router.put('/:id/status', protect, restrictTo('admin'), updateOrderStatus);

export default router;