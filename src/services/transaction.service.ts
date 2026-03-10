import { EntityManager, DataSource } from "typeorm";
import { Transaction, TransactionType } from "../models/Transaction";

export class TransactionService {
    constructor(private dataSource: DataSource) { }

    /**
     * Create a transaction record
     * @param dataSource DataSource instance for database access
     * @param manager optional EntityManager to participate in a DB transaction
     */
    async createTransaction(
        dataSource: DataSource,
        userId: string,
        walletId: string,
        type: TransactionType,
        amountEUR: number,
        goldAmount: number,
        goldPrice: number,
        idempotencyKey?: string,
        manager?: EntityManager
    ): Promise<Transaction> {
        const repo = manager
            ? manager.getRepository(Transaction)
            : dataSource.getRepository(Transaction);

        // 1️⃣ Check idempotency to avoid duplicates
        if (idempotencyKey) {
            const existing = await repo.findOne({ where: { idempotencyKey } });
            if (existing) return existing;
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
    }

    /**
     * Retrieve all transactions for a user
     */
    async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
        const repo = this.dataSource.getRepository(Transaction);
        return repo.find({
            where: { userId },
            order: { createdAt: "DESC" },
        });
    }
}