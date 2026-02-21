import Wishlist from '../models/wishlist.model.js';
import Product from '../models/product.model.js';

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    let wishlist = await Wishlist.findOne({ user: userId }).populate('items.product');
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
      await wishlist.save();
    }
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    const existingProduct = wishlist.items.find(item => item.product.toString() === productId);
    if (existingProduct) {
        return res.status(400).json({ message: 'Product already in wishlist' });
    } else {
        wishlist.items.push({ product: productId });
    }

    await wishlist.save();
    await wishlist.populate('items.product');
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;
    
        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
          return res.status(404).json({ message: 'Wishlist not found' });
        }
    
        wishlist.items = wishlist.items.filter(item => item.product.toString() !== productId);
        await wishlist.save();
        await wishlist.populate('items.product');
        res.status(200).json(wishlist);
      } catch (error) {
        res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
      }
};

export const clearWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const wishlist = await Wishlist.findOneAndUpdate(
          { user: userId },
          { items: [] },
          { new: true }
        );
        res.status(200).json(wishlist);
      } catch (error) {
        res.status(500).json({ message: 'Error clearing wishlist', error: error.message });
      }
};
