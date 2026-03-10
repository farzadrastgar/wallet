import express, { Router } from "express";
import authMiddleware from "../middlewares/authorize";
import validate from "../middlewares/validate";
import { WalletController } from "../controllers/wallet.controller";
import { buyGoldSchema, walletQuerySchema, sellGoldSchema } from "../schemas/wallet.schema";
import { WalletService } from "../services/wallet.service";
import { TransactionService } from "../services/transaction.service";
import { AppDataSource } from "../utils/db";

const transactionService = new TransactionService(AppDataSource);

const walletService = new WalletService(AppDataSource, transactionService);
const walletController = new WalletController(walletService);

const router: Router = express.Router();

router.get("/:id", authMiddleware, validate({ query: walletQuerySchema }), walletController.getWalletHandler.bind(walletController));

router.post("/buy", authMiddleware, validate({ body: buyGoldSchema }), walletController.buyHandler.bind(walletController));
router.post("/sell", authMiddleware, validate({ body: sellGoldSchema }), walletController.sellHandler.bind(walletController));


export default router;