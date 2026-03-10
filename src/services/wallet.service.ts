import { Wallet } from "../models/Wallet";
import { User } from "../models/User";
import { EntityManager, DataSource } from "typeorm";
import { TransactionService } from "./transaction.service";

export class WalletService {
    static GOLD_PRICE_EUR = 65; // Mock gold price

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
        const walletRepo = this.dataSource.getRepository(Wallet);
        return walletRepo.findOne({
            where: { userId }
        });
    }


    async buyGold(userId: string, amountEUR: number, idempotencyKey?: string) {
        if (amountEUR <= 0) throw new Error("Amount must be positive");

        return this.dataSource.transaction(async (manager: EntityManager) => {
            const walletRepo = manager.getRepository(Wallet);

            // 1️⃣ Fetch wallet with row-level lock to prevent concurrent updates
            const wallet = await walletRepo.findOne({
                where: { userId },
                lock: { mode: "pessimistic_write" },
            });

            if (!wallet) throw new Error("Wallet not found");

            // 2️⃣ Calculate gold to credit
            const goldAmount = amountEUR / WalletService.GOLD_PRICE_EUR;

            // 3️⃣ Update wallet balances
            wallet.fiatBalance = (Number(wallet.fiatBalance) + amountEUR).toString();
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
    }

    async sellGold(userId: string, amountEUR: number, idempotencyKey?: string) {
        if (amountEUR <= 0) throw new Error("Amount must be positive");

        return this.dataSource.transaction(async (manager: EntityManager) => {
            const walletRepo = manager.getRepository(Wallet);

            // 1️⃣ Fetch wallet with row-level lock to prevent concurrent updates
            const wallet = await walletRepo.findOne({
                where: { userId },
                lock: { mode: "pessimistic_write" },
            });

            if (!wallet) throw new Error("Wallet not found");

            // 2️⃣ Calculate gold to deduct
            const goldAmount = amountEUR / WalletService.GOLD_PRICE_EUR;

            // 3️⃣ Check if wallet has enough gold
            if (Number(wallet.goldBalance) < goldAmount) {
                throw new Error("Insufficient gold balance");
            }

            // 4️⃣ Update wallet balances
            wallet.goldBalance = (Number(wallet.goldBalance) - goldAmount).toFixed(8); // keep 8 decimals
            wallet.fiatBalance = (Number(wallet.fiatBalance) - amountEUR).toFixed(2); // keep 2 decimals
            await walletRepo.save(wallet);

            // 5️⃣ Log transaction via TransactionService, using same manager
            const transaction = await this.transactionService.createTransaction(
                this.dataSource,
                userId,
                wallet.id,
                "SELL",
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
    }
}