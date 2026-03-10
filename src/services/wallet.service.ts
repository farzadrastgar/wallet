import { Wallet } from "../models/Wallet";
import { User } from "../models/User";
import { EntityManager, DataSource } from "typeorm";
import { TransactionService } from "./transaction.service";
import { redisClient } from "../utils/redis";
export class WalletService {

    static GOLD_PRICE_EUR = Number(process.env["GOLD_PRICE_EUR"] || 65); // Default to 65 EUR/g if not set
    constructor(
        private dataSource: DataSource,
        private transactionService: TransactionService
    ) { }

    async createWallet(user: User, goldBalance: number, fiatBalance: number, manager: EntityManager) {
        const wallet = new Wallet();
        wallet.user = user;  // Assuming 'user' is a valid relation property in Wallet
        wallet.goldBalance = goldBalance.toString(); // Convert to string for decimal type
        wallet.fiatBalance = fiatBalance.toString(); // Convert to string for decimal type
        return await manager.save(Wallet, wallet);
    }

    async getWalletByUserId(userId: string): Promise<Wallet | null> {
        const cacheKey = `wallet:${userId}`;

        // 1️⃣ Try Redis first
        const cached = await redisClient.get(cacheKey);

        if (cached) {
            return JSON.parse(cached);
        }

        // 2️⃣ If not in cache → query DB
        const walletRepo = this.dataSource.getRepository(Wallet);

        const wallet = await walletRepo.findOne({
            where: { userId }
        });

        // 3️⃣ Store in Redis
        if (wallet) {
            await redisClient.set(
                cacheKey,
                JSON.stringify(wallet),
                { EX: 60 } // expire in 60 seconds
            );
        }

        return wallet;
    }


    async buyGold(userId: string, amountEUR: number, idempotencyKey?: string) {
        if (amountEUR <= 0) throw new Error("Amount must be positive");

        const result = this.dataSource.transaction(async (manager: EntityManager) => {
            const walletRepo = manager.getRepository(Wallet);

            // 1️⃣ Fetch wallet with row-level lock to prevent concurrent updates
            const wallet = await walletRepo.findOne({
                where: { userId },
                lock: { mode: "pessimistic_write" },
            });

            if (!wallet) throw new Error("Wallet not found");

            // 2️⃣ Calculate gold to credit
            const goldAmount = amountEUR / WalletService.GOLD_PRICE_EUR;

            // 3️⃣ Check if wallet has enough gold
            if (Number(wallet.fiatBalance) < amountEUR) {
                throw new Error("Insufficient fiat balance");
            }


            // 3️⃣ Update wallet balances
            wallet.fiatBalance = (Number(wallet.fiatBalance) - amountEUR).toString();
            wallet.goldBalance = (Number(wallet.goldBalance) + goldAmount).toString();
            await walletRepo.save(wallet);

            // 4️⃣ Log transaction via TransactionService, using same manager
            const transaction = await this.transactionService.createTransaction(
                this.dataSource,
                userId,
                wallet.id,
                "BUY",
                amountEUR,
                goldAmount,
                WalletService.GOLD_PRICE_EUR,
                idempotencyKey,
                manager // ensures this is part of the same DB transaction
            );

            return {
                wallet,
                transaction,
            };
        });

        // ✅ Transaction committed successfully → invalidate cache
        await redisClient.del(`wallet:${userId}`);

        return result;
    }

    async sellGold(userId: string, amountGold: number, idempotencyKey?: string) {
        if (amountGold <= 0) throw new Error("Amount must be positive");

        const result = this.dataSource.transaction(async (manager: EntityManager) => {
            const walletRepo = manager.getRepository(Wallet);

            // 1️⃣ Fetch wallet with row-level lock to prevent concurrent updates
            const wallet = await walletRepo.findOne({
                where: { userId },
                lock: { mode: "pessimistic_write" },
            });

            if (!wallet) throw new Error("Wallet not found");

            // 2️⃣ Calculate gold to deduct
            const amountEUR = amountGold * WalletService.GOLD_PRICE_EUR;

            // 3️⃣ Check if wallet has enough gold
            if (Number(wallet.goldBalance) < amountGold) {
                throw new Error("Insufficient gold balance");
            }

            // 4️⃣ Update wallet balances
            wallet.goldBalance = (Number(wallet.goldBalance) - amountGold).toFixed(8); // keep 8 decimals
            wallet.fiatBalance = (Number(wallet.fiatBalance) + amountEUR).toFixed(2); // keep 2 decimals
            await walletRepo.save(wallet);

            // 5️⃣ Log transaction via TransactionService, using same manager
            const transaction = await this.transactionService.createTransaction(
                this.dataSource,
                userId,
                wallet.id,
                "SELL",
                amountEUR,
                amountGold,
                WalletService.GOLD_PRICE_EUR,
                idempotencyKey,
                manager // ensures this is part of the same DB transaction
            );

            return {
                wallet,
                transaction,
            };
        });

        // ✅ Transaction committed successfully → invalidate cache
        await redisClient.del(`wallet:${userId}`);

        return result;
    }
}