import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, password, email } = req.body;
      const user = await authService.register(username, password, email);
      res.status(201).json({ message: "User created", user });
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