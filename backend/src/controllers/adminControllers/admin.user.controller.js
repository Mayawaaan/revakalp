import mongoose from "mongoose";
import User from "../../models/user.model.js";
import { SAFE_USER_PROJECTION } from "../../lib/security.js";

const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, search, role } = req.query;
    const filter = {};

    if (search && String(search).trim()) {
      const regex = new RegExp(escapeRegex(String(search).trim()), "i");
      filter.$or = [{ fullName: regex }, { email: regex }];
    }

    if (role && ["user", "admin"].includes(String(role).toLowerCase())) {
      filter.role = String(role).toLowerCase();
    }

    const wantsPagination = page !== undefined || limit !== undefined;
    if (!wantsPagination) {
      const users = await User.find(filter)
        .select(SAFE_USER_PROJECTION)
        .sort({ createdAt: -1 })
        .lean();
      return res.status(200).json(users);
    }

    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
    const requestedPage = Math.max(1, Number(page) || 1);
    const total = await User.countDocuments(filter);
    const totalPages = total > 0 ? Math.ceil(total / safeLimit) : 0;
    const safePage = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;
    const skip = (safePage - 1) * safeLimit;

    const users = await User.find(filter)
      .select(SAFE_USER_PROJECTION)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean();

    return res.status(200).json({
      users,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select(SAFE_USER_PROJECTION);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
