import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';

// Generate JWT token
const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body as RegisterInput;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: 'Email already in use' });
    return;
  }

  const user = await User.create({ name, email, password });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id.toString(), user.role),
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as LoginInput;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id.toString(), user.role),
  });
};