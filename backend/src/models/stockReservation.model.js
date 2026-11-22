import mongoose from "mongoose";

const stockReservationSchema = new mongoose.Schema(
  {
    reservationToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
      index: true,
    },
    size: {
      type: String,
      default: "NO_SIZE",
      trim: true,
      uppercase: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    channel: {
      type: String,
      enum: ["web", "pos"],
      default: "web",
    },
    state: {
      type: String,
      enum: ["active", "committed", "released", "expired"],
      default: "active",
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const StockReservation = mongoose.model("StockReservation", stockReservationSchema);
export default StockReservation;
