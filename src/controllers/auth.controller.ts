import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private authService: AuthService) { }
  async register(req: Request, res: Response) {
    const { username, password, email } = req.body;

    try {
      const result = await this.authService.registerWithWallet(username, password, email);


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

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const result = await this.authService.login(username, password);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}