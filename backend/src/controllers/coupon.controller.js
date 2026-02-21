import Coupon from '../models/coupon.model.js';

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