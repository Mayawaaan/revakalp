import mongoose from "mongoose";
import dotenv from "dotenv";
import Type from "./src/models/type.model.js";
import connectDB from "./src/lib/db.js";

dotenv.config();

const typesSeed = [
  // ===================== SAREE =====================
  {
    slug: "all-sarees",
    name: "All",
    image: "https://res.cloudinary.com/dn9vvfdjp/image/upload/v1769278548/e-commerce/dtjavugz3aqmurjgo4fn.png",
    category: "saree",
  },
  {
    slug: "banarasi",
    name: "Banarasi",
    image: "https://res.cloudinary.com/dn9vvfdjp/image/upload/v1769278484/e-commerce/bdktg1xwflfsuh7qfyug.png",
    category: "saree",
  },
  {
    slug: "kanjivaram",
    name: "Kanjivaram",
    image: "https://images.unsplash.com/photo-1594633312681",
    category: "saree",
  },
  {
    slug: "paithani",
    name: "Paithani",
    image: "https://images.unsplash.com/photo-1594633312681",
    category: "saree",
  },
  {
    slug: "bandhani",
    name: "Bandhani",
    image: "https://images.unsplash.com/photo-1600180758895",
    category: "saree",
  },
  {
    slug: "mangalagiri",
    name: "Mangalagiri",
    image: "https://images.unsplash.com/photo-1600180758895",
    category: "saree",
  },

  // ===================== SUIT =====================
  {
    slug: "chikankari",
    name: "Chikankari",
    image: "https://res.cloudinary.com/dn9vvfdjp/image/upload/v1768992023/e-commerce/c6nje1zp1wbkzsphgy8e.png",
    category: "suit",
  },
  {
    slug: "punjabi",
    name: "Punjabi",
    image: "https://res.cloudinary.com/dn9vvfdjp/image/upload/v1768992071/e-commerce/ucvmdszmu1ibaihyrrd3.png",
    category: "suit",
  },
  {
    slug: "anarkali",
    name: "Anarkali",
    image: "https://res.cloudinary.com/dn9vvfdjp/image/upload/v1768992048/e-commerce/lhyixrmvpatnlr8shv43.png",
    category: "suit",
  },

  // ===================== KURTA =====================
  {
    slug: "straight",
    name: "Straight",
    image: "https://res.cloudinary.com/dn9vvfdjp/image/upload/v1768990539/e-commerce/o9s3hsjqr2fakhxwrbdc.png",
    category: "kurta",
  },
  {
    slug: "a-line",
    name: "A-Line",
    image: "https://res.cloudinary.com/dn9vvfdjp/image/upload/v1768990562/e-commerce/sdfuppq1qfglpgoxepb1.png",
    category: "kurta",
  },
  {
    slug: "flared",
    name: "Flared",
    image: "https://res.cloudinary.com/dn9vvfdjp/image/upload/v1768990595/e-commerce/wvw0ucxqj3zf3twl7tbj.png",
    category: "kurta",
  },
];

const seedTypes = async () => {
  try {
    await connectDB();

    // Prevent duplicate seeding
    await Type.deleteMany({});
    await Type.insertMany(typesSeed);

    console.log("✅ Types seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding types:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedTypes();