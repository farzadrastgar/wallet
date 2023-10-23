import mongoose from "mongoose";
import log from "./logger";

async function connectDB() {
  try {
    const { MONGO_URL } = process.env;
    await mongoose.connect(MONGO_URL!);
    log.success("connected to db ");
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
}

export default connectDB;
