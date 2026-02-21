// d:\Websites\E-Commerce\backend\src\scripts\seed.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/product.model.js";


// Load environment variables from .env file
dotenv.config();

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);


    // 4. Create Demo Products
    // Note: We manually provide 'code' and image URLs here.
    const products = [
      {
        code: "MH001",
        name: "Paithani Silk Saree",
        description: "Traditional Paithani saree with peacock border.",
        price: 12000,
        discount: 0,
        image: [
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
        ],
        category: "Saree",
        subCategory: "Silk",
        type: "Paithani",
        gender: "Women",
        state: "Maharashtra",
        sizes: ["Free Size"],
        stock: 25,
        date: Date.now(),
        bestseller: true,
        print: "Peacock",
        exclusivity: "High",
      },
      {
        code: "WB002",
        name: "Handloom Cotton Saree",
        description: "Lightweight cotton saree perfect for summer.",
        price: 2500,
        discount: 10,
        discountedPrice: 2250,
        image: [
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
        ],
        category: "Saree",
        subCategory: "Cotton",
        type: "Tant",
        gender: "Women",
        state: "West Bengal",
        sizes: ["Free Size"],
        stock: 50,
        date: Date.now(),
        bestseller: false,
        print: "Floral",
        exclusivity: "Medium",
      },
    ];

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
