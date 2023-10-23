import express, { Router, Request, Response } from "express";
import { loginHandler, signupHandler } from "../controllers/auth.controller";
import validate from "../middlewares/validate";
import { loginSchema, signUpSchema } from "../schemas/auth.schema";

const router: Router = express.Router();

router.post("/signup", validate(signUpSchema), loginHandler);

router.post("/login", validate(loginSchema), signupHandler);

export default router;
