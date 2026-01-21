import express from "express";
import dotenv from "dotenv";
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
import adminRoutes from "./src/routes/admin.routes.js";
import settingsRoutes from "./src/routes/settings.routes.js";
import fs from "fs";
import path from "path";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

// Create the uploads directory if it doesn't exist
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/types", typeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);

app.listen(PORT, () => {
    console.log("server is running on http://localhost:" + PORT);
    connectDB();
    if (process.env.MONGO_URI) {
        console.log("MONGO_URI environment variable is loaded.");
    } else {
        console.error("MONGO_URI environment variable is NOT loaded. Please check your .env file.");
    }
});