import type { Request, Response } from "express";
import Order from "../models/order.model";
import type { CreateOrderInput } from "../schemas/order.schema";

export const createOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { items, shippingAddress } = req.body as CreateOrderInput;

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const order = await Order.create({
    user: req.user!.id,
    items,
    shippingAddress,
    totalPrice,
  });

  res.status(201).json(order);
};

export const getMyOrders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const orders = await Order.find({ user: req.user!.id }).sort({
    createdAt: -1,
  });
  res.json(orders);
};

export const getAllOrders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  res.json(order);
};
