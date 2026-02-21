import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  // ❌ REMOVE custom _id completely

  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      price: Number,
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

  paymentMethod: String,
  subtotal: Number,
  discount: Number,
  deliveryFee: Number,
  total: Number,

  status: {
    type: String,
    default: "Processing",
    enum: [
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
}, { timestamps: true });


// Add initial status to history when order is created
orderSchema.pre('save', function () {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [
      {
        status: this.status,
        timestamp: new Date(),
        note: 'Order placed',
      },
    ];
  }
});


const Order = mongoose.model('Order', orderSchema);

export default Order;
