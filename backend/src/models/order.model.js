import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
    },
  ],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, default: '' },
  },
  paymentMethod: { type: String, required: true },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    required: true, 
    default: 'Processing',
    enum: ['Processing', 'Confirmed', 'Preparing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned']
  },
  trackingNumber: { type: String, default: '' },
  carrier: { type: String, default: '' },
  estimatedDelivery: { type: Date },
  statusHistory: [statusHistorySchema],
  notes: { type: String, default: '' },
}, { timestamps: true });

// Add initial status to history when order is created
orderSchema.pre('save', function(next) {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [{
      status: this.status,
      timestamp: new Date(),
      note: 'Order placed'
    }];
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
