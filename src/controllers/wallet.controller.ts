import { Request, Response } from "express";
import { WalletService } from "../services/wallet.service";


export const getWalletHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Invalid user id" });
    }

    try {
        const wallet = await WalletService.getWalletByUserId(id);
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        return res.json({ userId: id, wallet });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

