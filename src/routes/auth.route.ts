import express, { Router, Request, Response } from "express";
import { loginHandler, signUpHandler } from "../controllers/auth.controller";
import validate from "../middlewares/validate";
import { loginSchema, signUpSchema } from "../schemas/auth.schema";

const router: Router = express.Router();

router.post("/signup", validate(signUpSchema), signUpHandler);

router.post("/login", validate(loginSchema), loginHandler);

export default router;
