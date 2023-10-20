import mongoose from "mongoose";
import "dotenv/config";

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URL!);
  console.log("connected to db");
}

export default connectDB;
