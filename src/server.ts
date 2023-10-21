import path from "path";
import connectDB from "./utils/db";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import app from "./app";
const port = process.env.PORT!;

app.listen(port, () => {
  console.log(`Example app list ening on port ${port}`);
  connectDB();
});
