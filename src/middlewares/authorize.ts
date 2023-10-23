import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import log from "../utils/logger";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ eror: "Invalid authorization header" });
  }

  const token = authorizationHeader.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Authorization token not found" });
  }

  try {
    const decoded = jwt.verify(token, (process.env as any).JWT_SECRET_KEY);
    (req as any).user = decoded;
    return next();
  } catch (err) {
    log.error(err);
    return res.status(401).json({ error: "Invalid token" });
  }
};
export default authMiddleware;
