import express, { Router } from "express";
import authMiddleware from "../middlewares/authorize";
import validate from "../middlewares/validate";
import { TransactionService } from "../services/transaction.service";
import { TransactionController } from "../controllers/transaction.controller";
import { AppDataSource } from "../utils/db";
import { transactionQuerySchema } from "../schemas/transaction.schema";

const transactionService = new TransactionService(AppDataSource);
const transactionController = new TransactionController(transactionService);
const router: Router = express.Router();

router.get("/", authMiddleware, validate({ query: transactionQuerySchema }), transactionController.getTransactionHandler.bind(transactionController));


export default router;