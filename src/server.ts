import path from "path";
import connectDB from "./utils/db";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import app from "./app";
import log from "./utils/logger";
const port = process.env.PORT!;

app.listen(port, () => {
  log.success(`App listening on port ${port}`);
  connectDB();
});
