import { Wallet } from "../models/Wallet";
import { User } from "../models/User";
import { EntityManager } from "typeorm";

export class WalletService {
    static async createWallet(user: User, goldBalance: number, fiatBalance: number, manager: EntityManager) {
        const wallet = new Wallet();
        wallet.user = user;  // Assuming 'user' is a valid relation property in Wallet
        wallet.goldBalance = goldBalance.toString(); // Convert to string for decimal type
        wallet.fiatBalance = fiatBalance.toString(); // Convert to string for decimal type
        return await manager.save(Wallet, wallet);
    }
}