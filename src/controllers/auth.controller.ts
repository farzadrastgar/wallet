import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AppDataSource } from "../utils/db";
import { WalletService } from "../services/wallet.service";

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response) {
    const { username, password, email } = req.body;

    try {
      // Atomic transaction
      const result = await AppDataSource.manager.transaction(async (manager) => {
        // 1️⃣ Create user via AuthService (pass manager)
        const user = await AuthService.register(username, password, email, manager);

        // 2️⃣ Create wallet via WalletService (pass manager)
        const wallet = await WalletService.createWallet(
          user,
          0,
          0,
          manager
        );
        return { user, wallet };
      });

      res.status(201).json({
        message: "User and wallet created",
        user: { id: result.user.id, username: result.user.username, email: result.user.email },
        wallet: {
          id: result.wallet.id,
          goldBalance: result.wallet.goldBalance,
          fiatBalance: result.wallet.fiatBalance
        }
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}