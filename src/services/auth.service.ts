import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DataSource, DeepPartial, EntityManager } from "typeorm";
import { WalletService } from "./wallet.service";

const SALT_ROUNDS = 10;
if (!process.env["JWT_SECRET"]) throw new Error("JWT_SECRET is not defined");
const { JWT_SECRET, INITIAL_BALANCE_EUR } = process.env;

export class AuthService {

    constructor(
        private dataSource: DataSource,
        private walletService: WalletService
    ) { }

    async registerWithWallet(username: string, password: string, email: string) {
        return this.dataSource.transaction(async (manager: EntityManager) => {
            // Create user
            const user = await this.register(username, password, email, manager);

            // Create wallet
            const wallet = await this.walletService.createWallet(user, 0, Number(INITIAL_BALANCE_EUR), manager);

            return { user, wallet };
        });
    }
    // Register a new user
    async register(
        username: string,
        password: string,
        email?: string,
        manager?: EntityManager,
    ) {
        const repo = manager ? manager.getRepository(User) : this.dataSource.getRepository(User);

        // 1️⃣ Check if username exists
        const existing = await repo.findOne({ where: { username } });
        if (existing) throw new Error("Username already exists");

        // 2️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // 3️⃣ Create user object
        const userData: DeepPartial<User> = {
            username,
            password: hashedPassword,
            ...(email !== undefined ? { email } : {}),
        };

        const user = repo.create(userData);

        // 4️⃣ Save user to DB
        await repo.save(user);

        // 5️⃣ Return saved user
        return user;
    }

    // Login and generate JWT
    async login(username: string, password: string) {
        const repo = await this.dataSource.getRepository(User)
        const user = await repo.findOne({ where: { username } });
        if (!user) throw new Error("Invalid username or password");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Invalid username or password");

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

        return { user, token };
    }


}