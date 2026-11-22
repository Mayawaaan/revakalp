import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true, // wb04, mh02, etc.
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

    category: { type: String, required: true, index: true },
    subCategory: { type: String, required: true },
    type: { type: String, required: true },
    gender: { type: String, required: true },

    state: { type: String, required: true },
    hasSizes: { type: Boolean, default: false },
    sizes: [{ type: String }],

    stock: { type: Number, required: true, default: 0, min: 0 },
    reserved: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active",
      index: true,
    },
    date: { type: Number, required: true },

    bestseller: { type: Boolean, default: false },
    print: { type: String },

    exclusivity: { type: String },

    // Category-specific garment intelligence metadata
    specs: {
      fabric: { type: String, default: "" },
      weave: { type: String, default: "" },
      length: { type: String, default: "" },
      blouseIncluded: { type: Boolean, default: false },
      includedPieces: { type: String, default: "" },
      care: { type: String, default: "" },
      provenance: { type: String, default: "" },
      gsm: { type: String, default: "" },
      alterationNotes: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
