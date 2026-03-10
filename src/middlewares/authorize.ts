import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import log from "../utils/logger";
if (!process.env['JWT_SECRET']) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid authorization header" });
  }

  const token = authorizationHeader.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Authorization token not found" });
  }

  try {
    const decoded = jwt.verify(token, (process.env as any).JWT_SECRET);
    (req as any).user = decoded;
    return next();
  } catch (err) {
    log.error(err);
    return res.status(401).json({ error: "Invalid token" });
  }
};
export default authMiddleware;
