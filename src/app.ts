import express from "express";
import { Express, Response } from "express";
import helmet from "helmet";
import walletRouter from "./routes/wallet.route";
import authRouter from "./routes/auth.route";
import authMiddleware from "./middlewares/authorize";
import transactionRouter from "./routes/transaction.route";

const app: Express = express();
app.use(helmet());
app.use(express.json());

app.get("/health", (_, res: Response) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);
app.use("/wallet", walletRouter);
app.use("/transaction", transactionRouter);


app.use(authMiddleware);

export default app;
