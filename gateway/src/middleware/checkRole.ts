import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';

export const checkRole = (requiredRole: 'rider' | 'driver') => {
    return (req: Request & { user: User }, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;

        if (!userRole) {
            return res.status(401).json({ message: 'Unauthorized: User role not found' });
        }

        if (userRole !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        next();
    };
};
