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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const Transaction_1 = require("../models/Transaction");
class TransactionService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    /**
     * Create a transaction record
     * @param dataSource DataSource instance for database access
     * @param manager optional EntityManager to participate in a DB transaction
     */
    createTransaction(dataSource, userId, walletId, type, amountEUR, goldAmount, goldPrice, idempotencyKey, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = manager
                ? manager.getRepository(Transaction_1.Transaction)
                : dataSource.getRepository(Transaction_1.Transaction);
            // 1️⃣ Check idempotency to avoid duplicates
            if (idempotencyKey) {
                const existing = yield repo.findOne({ where: { idempotencyKey } });
                if (existing)
                    return existing;
            }
            // 2️⃣ Create transaction entity
            const transaction = repo.create({
                userId,
                walletId,
                type,
                amountEUR,
                goldAmount,
                goldPrice,
                idempotencyKey: idempotencyKey || null,
            });
            // 3️⃣ Save to DB
            return repo.save(transaction);
        });
    }
    /**
     * Retrieve all transactions for a user
     */
    getTransactionsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.dataSource.getRepository(Transaction_1.Transaction);
            return repo.find({
                where: { userId },
                order: { createdAt: "DESC" },
            });
        });
    }
}
exports.TransactionService = TransactionService;
