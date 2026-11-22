import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xssLib from "xss-clean/lib/xss.js";
import { connectDB } from "./src/lib/db.js";
import { parseAllowedOrigins } from "./src/lib/security.js";
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
import seoRoutes from "./src/routes/seo.routes.js";
import complianceRoutes from "./src/routes/compliance.routes.js";
import mlRoutes from "./src/routes/ml.routes.js";
import { handleWebhook } from "./src/controllers/payment.controller.js";
import { getActiveCampaigns } from "./src/controllers/adminControllers/admin.cms.controller.js";
import { razorpay } from "./src/lib/razorpay.js";
import axios from "axios";
import fs from "fs";
import path from "path";

export { razorpay };

const PORT = process.env.PORT;
const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const allowedOrigins = parseAllowedOrigins(process.env.CORS_ORIGIN);
if (allowedOrigins.length === 0 && process.env.NODE_ENV !== "production") {
  console.warn("CORS_ORIGIN not set; allowing browser origins in non-production mode.");
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 && process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      const err = new Error("Origin not allowed by CORS");
      err.statusCode = 403;
      return callback(err, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  })
);

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    frameguard: { action: "deny" },
    noSniff: true,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    'camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.razorpay.com")'
  );
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  next();
});

// Raw body Razorpay webhook MUST mount before express.json() for accurate HMAC verification
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json", limit: "2mb" }),
  handleWebhook
);

const { clean: xssClean } = xssLib;
const sanitizeRequest = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = mongoSanitize.sanitize(req.body);
  }
  if (req.query && typeof req.query === "object") {
    const safeQuery = xssClean(mongoSanitize.sanitize(req.query));
    Object.defineProperty(req, "query", {
      value: safeQuery,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }
  if (req.params && typeof req.params === "object") {
    req.params = mongoSanitize.sanitize(req.params);
  }
  next();
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many authentication attempts, please try again shortly",
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many payment attempts, please wait a few minutes before retrying",
});

const couponLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many coupon checks, please try again shortly",
});

const grievanceLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many grievance submissions from this IP, please wait an hour",
});

const mlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many ML analysis requests, please try again shortly",
});

app.use("/api", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/verify-otp-reset", authLimiter);
app.use("/api/payment/create-order", paymentLimiter);
app.use("/api/payment/verify-payment", paymentLimiter);
app.use("/api/coupons/verify", couponLimiter);
app.use("/api/compliance/grievance", grievanceLimiter);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(sanitizeRequest);

if (process.env.BACKEND_URL) {
  setInterval(async () => {
    try {
      await axios.get(`${process.env.BACKEND_URL}`);
    } catch (e) {
      console.log("Keepalive ping skipped:", e.message);
    }
  }, 10 * 60 * 1000);
}

app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/types", typeRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/ml", mlLimiter, mlRoutes);
app.get("/api/cms/active", getActiveCampaigns);
app.use("/", seoRoutes);

// Global error handler — never expose internal stack traces to clients
app.use((err, req, res, _next) => {
  if (err?.name === "MulterError") {
    return res.status(400).json({ message: err.message || "Invalid file upload" });
  }
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Malformed JSON request body" });
  }
  if (err?.statusCode === 403) {
    return res.status(403).json({ message: err.message || "Forbidden" });
  }
  console.error("Unhandled server error:", err?.message || err);
  return res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log("server is running on http://localhost:" + PORT);

  connectDB();
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI environment variable is NOT loaded.");
  }
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET environment variable is NOT loaded.");
  }
  if (!process.env.RAZORPAY_KEY_ID) {
    console.error("RAZORPAY_KEY_ID environment variable is NOT loaded.");
  }
});
