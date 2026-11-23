import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import Wishlist from "../models/wishlist.model.js";
import Review from "../models/review.model.js";
import StockReservation from "../models/stockReservation.model.js";
import InventoryMovement from "../models/inventoryMovement.model.js";
import AnalyticsEvent from "../models/analyticsEvent.model.js";
import Coupon from "../models/coupon.model.js";
import Type from "../models/type.model.js";
import Collection from "../models/collection.model.js";

/**
 * Safely resets transactional store data (non-admin users, orders, current products,
 * carts, wishlists, reviews, stock reservations, inventory movements, telemetry)
 * while preserving Admin accounts, Settings, Coupons, and CMS campaigns.
 * Pass `--include-taxonomy` to also wipe Types and Collections.
 *
 * Usage: node src/scripts/cleanStoreData.js --confirm [--include-taxonomy]
 */
async function runCleanup() {
  if (!process.argv.includes("--confirm")) {
    console.error("Refusing to run without explicit --confirm flag.");
    process.exit(1);
  }
  const includeTaxonomy = process.argv.includes("--include-taxonomy");

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set in environment.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  try {
    const adminUsers = await User.find({ role: "admin" })
      .select("email fullName")
      .lean();

    const [
      deletedUsers,
      deletedOrders,
      deletedProducts,
      deletedCarts,
      deletedWishlists,
      deletedReviews,
      deletedReservations,
      deletedMovements,
      deletedTelemetry,
      resetCoupons,
      deletedTypes,
      deletedCollections,
    ] = await Promise.all([
      User.deleteMany({ role: { $ne: "admin" } }),
      Order.deleteMany({}),
      Product.deleteMany({}),
      Cart.deleteMany({}),
      Wishlist.deleteMany({}),
      Review.deleteMany({}),
      StockReservation.deleteMany({}),
      InventoryMovement.deleteMany({}),
      AnalyticsEvent.deleteMany({}),
      Coupon.updateMany({}, { $set: { usedCount: 0 } }),
      includeTaxonomy ? Type.deleteMany({}) : Promise.resolve({ deletedCount: 0 }),
      includeTaxonomy ? Collection.deleteMany({}) : Promise.resolve({ deletedCount: 0 }),
    ]);

    const summary = {
      preservedAdmins: adminUsers.map((a) => ({
        email: a.email,
        name: a.fullName,
      })),
      deleted: {
        nonAdminUsers: deletedUsers.deletedCount || 0,
        orders: deletedOrders.deletedCount || 0,
        products: deletedProducts.deletedCount || 0,
        carts: deletedCarts.deletedCount || 0,
        wishlists: deletedWishlists.deletedCount || 0,
        reviews: deletedReviews.deletedCount || 0,
        stockReservations: deletedReservations.deletedCount || 0,
        inventoryMovements: deletedMovements.deletedCount || 0,
        analyticsEvents: deletedTelemetry.deletedCount || 0,
        ...(includeTaxonomy
          ? {
              types: deletedTypes.deletedCount || 0,
              collections: deletedCollections.deletedCount || 0,
            }
          : {}),
      },
      resetCouponUsageCount: resetCoupons.modifiedCount || 0,
    };

    console.log("Store database cleanup completed:");
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await mongoose.disconnect();
  }
}

runCleanup().catch((err) => {
  console.error("Cleanup failed:", err?.message || err);
  process.exit(1);
});
