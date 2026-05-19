import { z } from 'zod';

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 charcters'),
        description: z.string().min(10, 'Description must be at least 10 charecters'),
        price: z.coerce.number().positive('Price must be a positive number'),
        category: z.coerce.number().int().nonnegative('Stock cannot be negative'),
    }),
}),