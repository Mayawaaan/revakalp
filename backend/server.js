import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./src/lib/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import collectionRoutes from "./src/routes/collection.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import couponRoutes from "./src/routes/coupon.routes.js";
import wishlistRoutes from "./src/routes/wishlist.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import typeRoutes from "./src/routes/type.routes.js";
import settingsRoutes from "./src/routes/settings.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import reviewRoutes from "./src/routes/review.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import Razorpay from "razorpay";
import axios from "axios";
import fs from "fs";
import path from "path";

export const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
    : null;

// console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);
// console.log("RAZORPAY SECRET:", process.env.RAZORPAY_KEY_SECRET);


const PORT = process.env.PORT;
const app = express();

// Create the uploads directory if it doesn't exist
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use(cors({
    origin: process.env.CORS_ORIGIN ,
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

setInterval(async () => {
  try {
    await axios.get(`${process.env.BACKEND_URL}`);
    console.log("Pinged backend");
  } catch (e) {
    console.log("Error:", e.message);
  }
}, 10 * 60 * 1000); // every 10 minutes




app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/types", typeRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(PORT, () => {
    console.log("server is running on http://localhost:" + PORT);
    
    connectDB();
    if (process.env.MONGO_URI) {
        console.log("MONGO_URI environment variable is loaded.");
    } else {
        console.error("MONGO_URI environment variable is NOT loaded. Please check your .env file.");
    }
    if (process.env.JWT_SECRET) {
        console.log("JWT_SECRET environment variable is loaded.");
    } else {
        console.error("JWT_SECRET environment variable is NOT loaded. Please check your .env file.");
    }
    if (process.env.RAZORPAY_KEY_ID) {
        console.log("RAZORPAY_KEY_ID environment variable is loaded.");
    } else {
        console.error("RAZORPAY_KEY_ID environment variable is NOT loaded. Please check your .env file or hosting environment.");
    }
});
