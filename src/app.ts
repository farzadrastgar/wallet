import express from "express";
import { Express, Response } from "express";
import helmet from "helmet";
import authRouter from "./routes/auth.route";
import authMiddleware from "./middlewares/authorize";

const app: Express = express();
app.use(helmet());
app.use(express.json());

app.get("/health", (_, res: Response) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);
app.use(authMiddleware);

export default app;
