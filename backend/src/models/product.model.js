import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,   // wb04, mh02, etc.
      index: true,
      uppercase: true,
      trim: true,
    },

    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    discountedPrice: { type: Number },

    image: [{ type: String, required: true }],

    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    type: { type: String, required: true },
    gender: { type: String, required: true },

    state: { type: String, required: true },
    hasSizes: { type: Boolean, default: false },
    sizes: [{ type: String }],

    stock: { type: Number, required: true, default: 0 },
    date: { type: Number, required: true },

    bestseller: { type: Boolean, default: false },
    print: { type: String },

    exclusivity: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
