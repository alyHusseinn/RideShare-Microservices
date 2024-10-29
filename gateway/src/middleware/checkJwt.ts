import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import { db } from '../config/db';
import { User, users } from '../models/user';
import { eq } from 'drizzle-orm';

export const checkJwt = async (req: Request & { user?: User }, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET!) as { userId: string };
        const user = await db.select().from(users).where(eq(users.id, +decoded.userId)).limit(1);
        req.user = user[0];
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};