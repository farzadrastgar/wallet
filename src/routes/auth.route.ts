import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { loginSchema, signUpSchema } from "../schemas/auth.schema";
import validate from "../middlewares/validate";
import { WalletService } from "../services/wallet.service";
import { AuthService } from "../services/auth.service";
import { TransactionService } from "../services/transaction.service";
import { AppDataSource } from "../utils/db";

const walletService = new WalletService(AppDataSource, new TransactionService(AppDataSource));
const authService = new AuthService(AppDataSource, walletService);
const authController = new AuthController(authService);
const router = Router();

// Register a new user
router.post("/register", validate({ body: signUpSchema }), authController.register.bind(authController));

// Login an existing user
router.post("/login", validate({ body: loginSchema }), authController.login.bind(authController));

export default router;
