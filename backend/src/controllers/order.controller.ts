import {Request, Response } from 'express';
import Order from '../models/order.model';
import { CreateOrderInput } from '../schemas/order.schema';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    const { items, shippingAddress } = req.body as CreateOrderInput;

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
        user: req.user!.id,
        items,
        shippingAddress,
        totalPrice,
    });

    res.status(201).json(order);
};