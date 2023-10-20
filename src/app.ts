import express from "express";
import { Express, Request, Response } from "express";
import helmet from "helmet";
import authRouter from "./routes/auth.route";

const app: Express = express();
app.use(helmet());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);

export default app;
