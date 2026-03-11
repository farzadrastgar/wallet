"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../utils/logger"));
if (!process.env['JWT_SECRET']) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
const authMiddleware = (req, res, next) => {
    const authorizationHeader = req.header("Authorization");
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Invalid authorization header" });
    }
    const token = authorizationHeader.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ error: "Authorization token not found" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    }
    catch (err) {
        logger_1.default.error(err);
        return res.status(401).json({ error: "Invalid token" });
    }
};
exports.default = authMiddleware;
