import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";

declare global {
    namespace Express {
        interface Request {
            user?: { userId: string };
        }
    }
}

export class TransactionController {
    constructor(private transactiontService: TransactionService) {

    }
    async getTransactionHandler(req: Request, res: Response) {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const userId = req.user.userId;

        try {
            const transactions = await this.transactiontService.getTransactionsByUserId(userId);
            return res.json({ userId: userId, transactions });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }


}





