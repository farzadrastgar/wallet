import connectDB from "./utils/db";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import app from "./app";

const port = process.env.PORT!;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  connectDB();
});
