import { Request, Response } from "express";
import { WalletService } from "../services/wallet.service";

declare global {
    namespace Express {
        interface Request {
            user?: { userId: string };
        }
    }
}

export class WalletController {
    constructor(private walletService: WalletService) {

    }
    async getWalletHandler(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        try {
            const wallet = await this.walletService.getWalletByUserId(id);
            if (!wallet) {
                return res.status(404).json({ message: "Wallet not found" });
            }

            return res.json({ userId: id, wallet });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async buyHandler(req: Request, res: Response) {

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
            const transaction = await this.walletService.buyGold(userId, amountEUR, idempotencyKey);

            return res.status(200).json({
                success: true,
                transaction,
            });
        } catch (err: any) {
            console.error("Buy gold error:", err);
            return res.status(400).json({
                success: false,
                message: err.message || "Failed to buy gold",
            });
        }
    }
}





