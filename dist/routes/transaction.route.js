"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorize_1 = __importDefault(require("../middlewares/authorize"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const transaction_service_1 = require("../services/transaction.service");
const transaction_controller_1 = require("../controllers/transaction.controller");
const db_1 = require("../utils/db");
const transaction_schema_1 = require("../schemas/transaction.schema");
const transactionService = new transaction_service_1.TransactionService(db_1.AppDataSource);
const transactionController = new transaction_controller_1.TransactionController(transactionService);
const router = express_1.default.Router();
router.get("/", authorize_1.default, (0, validate_1.default)({ query: transaction_schema_1.transactionQuerySchema }), transactionController.getTransactionHandler.bind(transactionController));
exports.default = router;
