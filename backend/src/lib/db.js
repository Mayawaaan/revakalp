import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

let retryTimer = null;
let isConnecting = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MongoDB connection skipped: MONGO_URI is not set.");
    return;
  }

  if (isConnecting || mongoose.connection.readyState === 1) {
    return;
  }

  isConnecting = true;
  try {
    const conn = await mongoose.connect(mongoUri, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message || error);
    console.error(
      "Action required: Verify your current public IP is allowed in MongoDB Atlas -> Network Access (or allow 0.0.0.0/0 for dynamic/ISP IPs) and ensure port 27017 is reachable. Retrying in 8s..."
    );
    if (!retryTimer) {
      retryTimer = setTimeout(() => {
        retryTimer = null;
        connectDB();
      }, 8000);
      retryTimer.unref?.();
    }
  } finally {
    isConnecting = false;
  }
};

export default connectDB;
