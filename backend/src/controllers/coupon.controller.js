import Coupon from '../models/coupon.model.js';

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Admin
export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, maxUses, expiryDate } = req.body;

    if (!code || !discountPercentage) {
      return res.status(400).json({ message: 'code and discountPercentage are required' });
    }

    const coupon = new Coupon({
      code,
      discountPercentage,
      maxUses,
      expiryDate,
    });
    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    res.status(400).json({ message: 'Error creating coupon', error: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Admin
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coupons', error: error.message });
  }
};

// @desc    Get a coupon by ID
// @route   GET /api/coupons/:id
// @access  Admin
export const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (coupon) {
            res.json(coupon);
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching coupon', error: error.message });
    }
}

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Admin
export const updateCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, maxUses, expiryDate, isActive } = req.body;
    
    const updateFields = {};
    if (code) updateFields.code = code;
    if (discountPercentage) updateFields.discountPercentage = discountPercentage;
    if (maxUses) updateFields.maxUses = maxUses;
    if (expiryDate) updateFields.expiryDate = expiryDate;
    if (isActive !== undefined) updateFields.isActive = isActive;

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (coupon) {
      res.json(coupon);
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating coupon', error: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (coupon) {
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting coupon', error: error.message });
  }
};

// @desc    Verify a coupon
// @route   POST /api/coupons/verify
// @access  Public
export const verifyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code });

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ message: 'Coupon is not active' });
        }

        if (coupon.expiryDate && coupon.expiryDate < new Date()) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            return res.status(400).json({ message: 'Coupon has reached its usage limit' });
        }

        res.json({
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying coupon', error: error.message });
    }
}