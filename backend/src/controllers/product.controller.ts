import { Request, Response } from 'express';
import Product from '../models/product.model';
import { CreateProductInput, UpdateProductInput } from '../schemas/product.schema';

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as CreateProductInput;

  const product = await Product.create({
    ...body,
    // image path set by Multer, fallback to empty string
    image: req.file ? `/uploads/${req.file.filename}` : '',
    createdBy: req.user!.id,
  });

  res.status(201).json(product);
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    const products = await Product.find();
    res.json(products);
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return
  }
  res.json(product)
};