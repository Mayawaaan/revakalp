import mongoose from "mongoose";

export const VALID_THEME_SCHEMES = [
  "royal-burgundy",
  "emerald-banaras",
  "indigo-jaipur",
  "saffron-udaipur",
  "peacock-kanchipuram",
  "jamuni-mysore",
  "rose-chanderi",
  "sandalwood-maheshwar",
  "obsidian-kashi",
];

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
      default: true,
    },
    upiEnabled: {
      type: Boolean,
      default: true,
    },
    demoPaymentMode: {
      type: Boolean,
      default: true,
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

    // Indian Business & Statutory Compliance Details
    legalEntityName: {
      type: String,
      default: "Revakalp",
    },
    gstin: {
      type: String,
      default: "",
    },
    grievanceOfficerName: {
      type: String,
      default: "Anjali Katare",
    },
    grievanceOfficerDesignation: {
      type: String,
      default: "Founder & Grievance Redressal Officer",
    },
    grievanceOfficerEmail: {
      type: String,
      default: "contact@revakalp.com",
    },
    grievanceOfficerPhone: {
      type: String,
      default: "+91 91096-76562",
    },
    countryOfOriginDefault: {
      type: String,
      default: "India",
    },

    // Storefront Theme & Color Grading
    themeScheme: {
      type: String,
      enum: VALID_THEME_SCHEMES,
      default: "royal-burgundy",
    },
    themeMode: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
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
