import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { loginSchema, signUpSchema } from "../schemas/auth.schema";
import validate from "../middlewares/validate";


const router = Router();

// Register a new user
router.post("/register", validate({ body: signUpSchema }), AuthController.register);

// Login an existing user
router.post("/login", validate({ body: loginSchema }), AuthController.login);

export default router;
