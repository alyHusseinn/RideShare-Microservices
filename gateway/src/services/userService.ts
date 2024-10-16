
import bcrypt from 'bcrypt';
import { User, users, NewUser } from '../models/user';
import { db } from '../config/db';
import { eq } from 'drizzle-orm';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config'

export class UserService {
    private readonly saltRounds = 10;

    async createUser(username: string, email: string, password: string, role: string = 'rider'): Promise<User> {
        const passwordHash = await bcrypt.hash(password, this.saltRounds);
        const newUser: NewUser = {
            username,
            email,
            passwordHash,
            role
        }
        const result = await db.insert(users).values(newUser).returning();
        return result[0] as User;
    }

    async loginUser(username: string, password: string): Promise<string | undefined> {
        const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
        if (user.length === 0) {
            return undefined;
        }
        const userData = user[0] as User;
        const passwordMatch = await bcrypt.compare(password, userData.passwordHash);
        if (!passwordMatch) {
            return undefined;
        }
        // create token
        const token = jwt.sign({ userId: userData.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        return token;
    }

    async getUserById(userId: string): Promise<User | undefined> {
        const user = await db.select().from(users).where(eq(users.id, +userId)).limit(1);
        return user[0] as User;
    }

    async deleteUser(userId: string): Promise<User> {
        const deletedUser = await db.delete(users).where(eq(users.id, +userId)).returning();
        return deletedUser[0];
    }

    async getAllUsers(): Promise<User[]> {
        const allUsers = await db.select().from(users);
        return allUsers as User[];
    }
}
