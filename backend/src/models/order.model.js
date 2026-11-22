import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: "" },
    actor: { type: String, default: "system" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        price: Number,
        originalPrice: Number,
        size: String,
        quantity: Number,
        image: String,
      },
    ],

    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      phone: String,
    },

    channel: {
      type: String,
      enum: ["web", "pos"],
      default: "web",
      index: true,
    },

    paymentMethod: String,
    paymentStatus: {
      type: String,
      enum: ["initiated", "pending", "verified_success", "verified_failure", "cod_confirmed", "refunded"],
      default: "initiated",
    },
    gatewayOrderId: { type: String, index: true },
    gatewayPaymentId: { type: String, default: "" },
    expectedAmountPaise: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    couponCode: { type: String, default: "" },
    couponCounted: { type: Boolean, default: false },
    reservationIds: [{ type: String }],

    subtotal: Number,
    discount: Number,
    deliveryFee: Number,
    total: Number,

    status: {
      type: String,
      default: "Processing",
      enum: [
        "PendingPayment",
        "Processing",
        "Confirmed",
        "Preparing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
    },

    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    statusHistory: [statusHistorySchema],
    notes: String,

    returnRequest: {
      requested: { type: Boolean, default: false },
      reason: { type: String, default: "" },
      inspectionStatus: {
        type: String,
        enum: ["none", "pending", "approved_restock", "approved_damaged", "rejected"],
        default: "none",
      },
      inspectedBy: { type: String, default: "" },
      inspectedAt: { type: Date },
      restocked: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function () {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [
      {
        status: this.status,
        timestamp: new Date(),
        note: "Order created",
      },
    ];
  }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
