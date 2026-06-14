import { z } from 'zod';

const orderItemSchema = z.object({
    product: z.string().min(1, 'Product ID is required'),
    name: z.string().min(1, 'Product name is required'),
    price: z.number().positive('Price must be positive'),
    quantity: z.number().int().positive('Quantitiy must be at least 1'),
    image: z.string().optional(),
});