import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // Store Settings
    storeName: {
      type: String,
      required: true,
      default: "Revakalp",
    },
    supportEmail: {
      type: String,
      required: true,
      default: "contact@revakalp.com",
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
      enum: ["INR", "USD", "EUR"],
    },
    currencySymbol: {
      type: String,
      required: true,
      default: "₹",
    },
    
    // Shipping Settings
    freeShippingThreshold: {
      type: Number,
      required: true,
      default: 500,
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 50,
    },
    
    // Payment Settings
    codEnabled: {
      type: Boolean,
      default: true,
    },
    razorpayEnabled: {
      type: Boolean,
      default: false,
    },
    razorpayKey: {
      type: String,
      default: "",
    },
    stripeEnabled: {
      type: Boolean,
      default: false,
    },
    
    // Notification Settings
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    
    // Security Settings
    admin2FA: {
      type: Boolean,
      default: false,
    },
    
    // Additional Settings
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    storeDescription: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
