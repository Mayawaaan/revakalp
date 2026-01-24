import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const protectRoute = async (req, res, next) => {
  try {
    let token;

// 1️⃣ Try cookie FIRST (most reliable)
if (req.cookies?.jwt) {
  token = req.cookies.jwt;
}

// 2️⃣ Only use header if it contains a REAL token
if (
  req.headers.authorization &&
  req.headers.authorization.startsWith("Bearer ")
) {
  const headerToken = req.headers.authorization.split(" ")[1];
  if (headerToken && headerToken !== "undefined") {
    token = headerToken;
  }
}

// console.log("Final token used:", token);

if (!token) {
  return res.status(401).json({ message: "Unauthorized - No Token Provided" });
}

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
