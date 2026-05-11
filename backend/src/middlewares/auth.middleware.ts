import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || ! authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }

}