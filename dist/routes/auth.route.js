"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_schema_1 = require("../schemas/auth.schema");
const validate_1 = __importDefault(require("../middlewares/validate"));
const wallet_service_1 = require("../services/wallet.service");
const auth_service_1 = require("../services/auth.service");
const transaction_service_1 = require("../services/transaction.service");
const db_1 = require("../utils/db");
const walletService = new wallet_service_1.WalletService(db_1.AppDataSource, new transaction_service_1.TransactionService(db_1.AppDataSource));
const authService = new auth_service_1.AuthService(db_1.AppDataSource, walletService);
const authController = new auth_controller_1.AuthController(authService);
const router = (0, express_1.Router)();
// Register a new user
router.post("/register", (0, validate_1.default)({ body: auth_schema_1.signUpSchema }), authController.register.bind(authController));
// Login an existing user
router.post("/login", (0, validate_1.default)({ body: auth_schema_1.loginSchema }), authController.login.bind(authController));
exports.default = router;
