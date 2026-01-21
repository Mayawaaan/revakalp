import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  couponCode: { type: String, default: '' },
  discountPercentage: { type: Number, default: 0 },
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
