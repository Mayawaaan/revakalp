import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../backend/src/models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/e-commerce";

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const adminEmail = "admin@example.com";
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("adminpassword", salt);

      const newAdmin = new User({
        fullName: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      await newAdmin.save();
      console.log("Admin user created successfully!");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error.message);
  } finally {
    mongoose.disconnect();
  }
};

seedAdmin();
