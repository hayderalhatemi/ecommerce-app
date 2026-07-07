import { z } from "zod";

const orderItemSchema = z.object({
  product: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().positive("Quantitiy must be at least 1"),
  image: z.string().optional(),
});

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
    shippingAddress: z.object({
      address: z.string().min(1, "Address is required"),
      city: z.string().min(1, "City is required"),
      postalCode: z.string().min(1, "Postal code is required"),
      country: z.string().min(1, "Country is required"),
    }),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];
