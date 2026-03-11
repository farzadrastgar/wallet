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
exports.TransactionController = void 0;
class TransactionController {
    constructor(transactiontService) {
        this.transactiontService = transactiontService;
    }
    getTransactionHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user || !req.user.userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const userId = req.user.userId;
            try {
                const transactions = yield this.transactiontService.getTransactionsByUserId(userId);
                return res.json({ userId: userId, transactions });
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
}
exports.TransactionController = TransactionController;
