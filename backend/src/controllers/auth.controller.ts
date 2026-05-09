import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';

// Generate jwt token
const generateToken = (id: string, role: string): => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: '7d'});
};

export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body as RegisterInput;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400).json({ message: 'Email already in use' });
        return;
    }
}