import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: [{ type: String, required: true }],
  category: { type: String, required: true }, // Silk, Cotton, Silk Blend, etc.
  subCategory: { type: String, required: true }, // Wedding, Festive, Daily, etc.
  type: { type: String, required: true }, // Saree, Suit, Kurta
  gender: { type: String, required: true }, // Women
  state: { type: String, required: true }, // Andhra Pradesh, etc.
  sizes: [{ type: String }], // ["Free Size"] or ["S", "M", "L", "XL"]
  stock: { type: Number, required: true, default: 0 },
  date: { type: Number, required: true },
  bestseller: { type: Boolean, default: false },
  print: { type: String }, // Zari Border, Motifs, etc.
  exclusivity: { type: String }, // Handloom, Heritage, etc.
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
