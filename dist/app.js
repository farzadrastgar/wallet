"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const wallet_route_1 = __importDefault(require("./routes/wallet.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const authorize_1 = __importDefault(require("./middlewares/authorize"));
const transaction_route_1 = __importDefault(require("./routes/transaction.route"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.get("/health", (_, res) => {
    res.send("Hello World!");
});
app.use("/auth", auth_route_1.default);
app.use("/wallet", authorize_1.default, wallet_route_1.default);
app.use("/transaction", authorize_1.default, transaction_route_1.default);
exports.default = app;
