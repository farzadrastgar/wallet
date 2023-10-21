import mongoose from "mongoose";
import log from "./logger";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    log.success("connected to db ");
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
}

export default connectDB;
