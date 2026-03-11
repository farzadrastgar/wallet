"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_ROUNDS = 10;
if (!process.env["JWT_SECRET"])
    throw new Error("JWT_SECRET is not defined");
const { JWT_SECRET, INITIAL_BALANCE_EUR } = process.env;
class AuthService {
    constructor(dataSource, walletService) {
        this.dataSource = dataSource;
        this.walletService = walletService;
    }
    registerWithWallet(username, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                // Create user
                const user = yield this.register(username, password, email, manager);
                // Create wallet
                const wallet = yield this.walletService.createWallet(user, 0, Number(INITIAL_BALANCE_EUR), manager);
                return { user, wallet };
            }));
        });
    }
    // Register a new user
    register(username, password, email, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = manager ? manager.getRepository(User_1.User) : this.dataSource.getRepository(User_1.User);
            // 1️⃣ Check if username exists
            const existing = yield repo.findOne({ where: { username } });
            if (existing)
                throw new Error("Username already exists");
            // 2️⃣ Hash password
            const hashedPassword = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
            // 3️⃣ Create user object
            const userData = Object.assign({ username, password: hashedPassword }, (email !== undefined ? { email } : {}));
            const user = repo.create(userData);
            // 4️⃣ Save user to DB
            yield repo.save(user);
            // 5️⃣ Return saved user
            return user;
        });
    }
    // Login and generate JWT
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = yield this.dataSource.getRepository(User_1.User);
            const user = yield repo.findOne({ where: { username } });
            if (!user)
                throw new Error("Invalid username or password");
            const valid = yield bcrypt_1.default.compare(password, user.password);
            if (!valid)
                throw new Error("Invalid username or password");
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
            return { user, token };
        });
    }
}
exports.AuthService = AuthService;
