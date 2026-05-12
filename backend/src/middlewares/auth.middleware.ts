import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }

    const token = authHeader.split('')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Not authorized, invaled token' });
    }
};
