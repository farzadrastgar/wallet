import express, { Router } from "express";
import authMiddleware from "../middlewares/authorize";
import validate from "../middlewares/validate";
import { getWalletHandler } from "../controllers/wallet.controller";
import { walletQuerySchema } from "../schemas/wallet.schema";

const router: Router = express.Router();

router.get("/:id", authMiddleware, validate({ query: walletQuerySchema }), getWalletHandler);

//router.post("/buy", authMiddleware, validate({ body: loginSchema }), buyHandler);
//router.post("/sell", authMiddleware, validate({ body: loginSchema }), sellHandler);


export default router;