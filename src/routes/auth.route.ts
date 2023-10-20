import express, { Router, Request, Response } from "express";
import { loginHandler, signupHandler } from "../controllers/auth.controller";

const router: Router = express.Router();

router.post("/signup", loginHandler);

router.post("/login", signupHandler);

export default router;
