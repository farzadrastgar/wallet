import express, { Router } from "express";
import authMiddleware from "../middlewares/authorize";
import validate from "../middlewares/validate";
import { loginSchema, signUpSchema } from "../schemas/auth.schema";
import { buyHandler, getWalletHandler, sellHandler } from "../controllers/wallet.controller";

const router: Router = express.Router();

router.get("/", authMiddleware, validate(signUpSchema), getWalletHandler);

router.post("/buy", authMiddleware, validate(loginSchema), buyHandler);
router.post("/sell", authMiddleware, validate(loginSchema), sellHandler);


export default router;