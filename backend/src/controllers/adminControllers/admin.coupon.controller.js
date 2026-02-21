import Coupon from "../../models/coupon.model.js";

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, description, expiryDate, maxUses } = req.body;

    if (!code || !discountPercentage) {
      return res.status(400).json({ message: "Code and discount percentage are required" });
    }

    const newCoupon = new Coupon({
      code,
      discountPercentage,
      description,
      expiryDate,
      maxUses,
    });
    console.log("Creating coupon:", newCoupon);
    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (error) {
    console.error("Error in createCoupon:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discountPercentage, description, isActive, expiryDate, maxUses } = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, discountPercentage, description, isActive, expiryDate, maxUses },
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json(updatedCoupon);
  } catch (error) {
    console.error("Error in updateCoupon:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCoupon:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllCoupons = async (req, res) => {
    try {
      const coupons = await Coupon.find({});
      res.status(200).json(coupons);
    } catch (error) {
      console.error("Error in getAllCoupons:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
