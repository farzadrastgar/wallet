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
exports.WalletController = void 0;
class WalletController {
    constructor(walletService) {
        this.walletService = walletService;
    }
    getWalletHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Invalid user id" });
            }
            try {
                const wallet = yield this.walletService.getWalletByUserId(id);
                if (!wallet) {
                    return res.status(404).json({ message: "Wallet not found" });
                }
                return res.json({ userId: id, wallet });
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    buyHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user || !req.user.userId) {
                    return res.status(401).json({ success: false, message: "Unauthorized" });
                }
                const userId = req.user.userId;
                const { amountEUR, idempotencyKey } = req.body;
                if (!amountEUR || amountEUR <= 0) {
                    return res.status(400).json({ success: false, message: "Invalid amountEUR" });
                }
                // Call the WalletService to handle the purchase
                const transaction = yield this.walletService.buyGold(userId, amountEUR, idempotencyKey);
                return res.status(200).json({
                    success: true,
                    transaction,
                });
            }
            catch (err) {
                console.error("Buy gold error:", err);
                return res.status(400).json({
                    success: false,
                    message: err.message || "Failed to buy gold",
                });
            }
        });
    }
    sellHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1️⃣ Check if user is authenticated
                if (!req.user || !req.user.userId) {
                    return res.status(401).json({ success: false, message: "Unauthorized" });
                }
                const userId = req.user.userId;
                const { amountGold, idempotencyKey } = req.body;
                // 2️⃣ Validate amount
                if (!amountGold || amountGold <= 0) {
                    return res.status(400).json({ success: false, message: "Invalid amountGold" });
                }
                // 3️⃣ Call WalletService to handle selling gold
                const transaction = yield this.walletService.sellGold(userId, amountGold, idempotencyKey);
                // 4️⃣ Return success response
                return res.status(200).json({
                    success: true,
                    transaction,
                });
            }
            catch (err) {
                console.error("Sell gold error:", err);
                return res.status(400).json({
                    success: false,
                    message: err.message || "Failed to sell gold",
                });
            }
        });
    }
}
exports.WalletController = WalletController;
