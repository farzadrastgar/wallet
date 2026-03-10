import { Wallet } from "../models/Wallet";
import { User } from "../models/User";
import { EntityManager } from "typeorm";
import { AppDataSource } from "../utils/db";

export class WalletService {
    private static walletRepo = AppDataSource.getRepository(Wallet);

    static async createWallet(user: User, goldBalance: number, fiatBalance: number, manager: EntityManager) {
        const wallet = new Wallet();
        wallet.user = user;  // Assuming 'user' is a valid relation property in Wallet
        wallet.goldBalance = goldBalance.toString(); // Convert to string for decimal type
        wallet.fiatBalance = fiatBalance.toString(); // Convert to string for decimal type
        return await manager.save(Wallet, wallet);
    }

    static async getWalletByUserId(userId: string): Promise<Wallet | null> {
        return this.walletRepo.findOne({
            where: { userId }
        });
    }
}