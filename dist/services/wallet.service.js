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
exports.WalletService = void 0;
const Wallet_1 = require("../models/Wallet");
const redis_1 = require("../utils/redis");
class WalletService {
    constructor(dataSource, transactionService) {
        this.dataSource = dataSource;
        this.transactionService = transactionService;
    }
    createWallet(user, goldBalance, fiatBalance, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = new Wallet_1.Wallet();
            wallet.user = user; // Assuming 'user' is a valid relation property in Wallet
            wallet.goldBalance = goldBalance.toString(); // Convert to string for decimal type
            wallet.fiatBalance = fiatBalance.toString(); // Convert to string for decimal type
            return yield manager.save(Wallet_1.Wallet, wallet);
        });
    }
    getWalletByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `wallet:${userId}`;
            // 1️⃣ Try Redis first
            const cached = yield redis_1.redisClient.get(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
            // 2️⃣ If not in cache → query DB
            const walletRepo = this.dataSource.getRepository(Wallet_1.Wallet);
            const wallet = yield walletRepo.findOne({
                where: { userId }
            });
            // 3️⃣ Store in Redis
            if (wallet) {
                yield redis_1.redisClient.set(cacheKey, JSON.stringify(wallet), { EX: 60 } // expire in 60 seconds
                );
            }
            return wallet;
        });
    }
    buyGold(userId, amountEUR, idempotencyKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amountEUR <= 0)
                throw new Error("Amount must be positive");
            const result = this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const walletRepo = manager.getRepository(Wallet_1.Wallet);
                // 1️⃣ Fetch wallet with row-level lock to prevent concurrent updates
                const wallet = yield walletRepo.findOne({
                    where: { userId },
                    lock: { mode: "pessimistic_write" },
                });
                if (!wallet)
                    throw new Error("Wallet not found");
                // 2️⃣ Calculate gold to credit
                const goldAmount = amountEUR / WalletService.GOLD_PRICE_EUR;
                // 3️⃣ Check if wallet has enough gold
                if (Number(wallet.fiatBalance) < amountEUR) {
                    throw new Error("Insufficient fiat balance");
                }
                // 3️⃣ Update wallet balances
                wallet.fiatBalance = (Number(wallet.fiatBalance) - amountEUR).toString();
                wallet.goldBalance = (Number(wallet.goldBalance) + goldAmount).toString();
                yield walletRepo.save(wallet);
                // 4️⃣ Log transaction via TransactionService, using same manager
                const transaction = yield this.transactionService.createTransaction(this.dataSource, userId, wallet.id, "BUY", amountEUR, goldAmount, WalletService.GOLD_PRICE_EUR, idempotencyKey, manager // ensures this is part of the same DB transaction
                );
                return {
                    wallet,
                    transaction,
                };
            }));
            // ✅ Transaction committed successfully → invalidate cache
            yield redis_1.redisClient.del(`wallet:${userId}`);
            return result;
        });
    }
    sellGold(userId, amountGold, idempotencyKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amountGold <= 0)
                throw new Error("Amount must be positive");
            const result = this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const walletRepo = manager.getRepository(Wallet_1.Wallet);
                // 1️⃣ Fetch wallet with row-level lock to prevent concurrent updates
                const wallet = yield walletRepo.findOne({
                    where: { userId },
                    lock: { mode: "pessimistic_write" },
                });
                if (!wallet)
                    throw new Error("Wallet not found");
                // 2️⃣ Calculate gold to deduct
                const amountEUR = amountGold * WalletService.GOLD_PRICE_EUR;
                // 3️⃣ Check if wallet has enough gold
                if (Number(wallet.goldBalance) < amountGold) {
                    throw new Error("Insufficient gold balance");
                }
                // 4️⃣ Update wallet balances
                wallet.goldBalance = (Number(wallet.goldBalance) - amountGold).toFixed(8); // keep 8 decimals
                wallet.fiatBalance = (Number(wallet.fiatBalance) + amountEUR).toFixed(2); // keep 2 decimals
                yield walletRepo.save(wallet);
                // 5️⃣ Log transaction via TransactionService, using same manager
                const transaction = yield this.transactionService.createTransaction(this.dataSource, userId, wallet.id, "SELL", amountEUR, amountGold, WalletService.GOLD_PRICE_EUR, idempotencyKey, manager // ensures this is part of the same DB transaction
                );
                return {
                    wallet,
                    transaction,
                };
            }));
            // ✅ Transaction committed successfully → invalidate cache
            yield redis_1.redisClient.del(`wallet:${userId}`);
            return result;
        });
    }
}
exports.WalletService = WalletService;
WalletService.GOLD_PRICE_EUR = Number(process.env["GOLD_PRICE_EUR"] || 65); // Default to 65 EUR/g if not set
