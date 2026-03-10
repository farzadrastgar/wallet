import { AppDataSource } from "../utils/db";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DeepPartial } from "typeorm";

const SALT_ROUNDS = 10;
if (!process.env["JWT_SECRET"]) throw new Error("JWT_SECRET is not defined");
const JWT_SECRET = process.env["JWT_SECRET"]

export class AuthService {
    private userRepo = AppDataSource.getRepository(User);

    // Register a new user
    async register(username: string, password: string, email?: string) {
        const existing = await this.userRepo.findOne({ where: { username } });
        if (existing) throw new Error("Username already exists");

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const userData: DeepPartial<User> = {
            username,
            password: hashedPassword,
            ...(email !== undefined ? { email } : {}),
        };

        const user = this.userRepo.create(userData);
        await this.userRepo.save(user);

        return user;
    }

    // Login and generate JWT
    async login(username: string, password: string) {
        const user = await this.userRepo.findOne({ where: { username } });
        if (!user) throw new Error("Invalid username or password");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Invalid username or password");

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

        return { user, token };
    }


}