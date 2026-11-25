import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (file, folder = "Revakalp") => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "image",
      quality: "auto:good",
      fetch_format: "auto",
      timeout: 120000,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    const httpCode = error?.http_code || error?.error?.http_code;
    const rawMsg = error?.message || error?.error?.message || "";
    if (httpCode === 413 || /file size too large|too large/i.test(rawMsg)) {
      const sizeErr = new Error(
        "Image exceeds the cloud storage upload limit. Please upload an image under 10 MB after optimization or upgrade your Cloudinary plan."
      );
      sizeErr.statusCode = 413;
      throw sizeErr;
    }
    const uploadErr = new Error(
      rawMsg ? `Image upload failed: ${rawMsg}` : "Error uploading image to Cloudinary"
    );
    uploadErr.statusCode = httpCode && httpCode >= 400 && httpCode < 500 ? httpCode : 502;
    throw uploadErr;
  }
};

export const deleteImageFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        throw new Error("Error deleting image from Cloudinary");
    }
};

export const getPublicIdFromUrl = (url) => {
    try {
        const regex = /profiles\/(.*?)\./;
        const match = url.match(regex);
        return match ? `profiles/${match[1]}` : null;
    } catch (error) {
        console.error("Error extracting public ID from URL:", error);
        return null;
    }
};


// Sliding session access token (default 2h) — refreshed silently in background
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "2h",
  });
};

// Long-lived: 14 days — stored in DB + sent as httpOnly cookie
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "14d",
  });
};

// Legacy alias (kept so nothing breaks during migration)
export const generateToken = generateAccessToken;