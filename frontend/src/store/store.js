import { create } from 'zustand';
import { createProductSlice } from './slices/productSlice';
import { createCartSlice } from './slices/cartSlice';
import { createAuthSlice } from './slices/authSlice';
import { createWishlistSlice } from './slices/wishlistSlice';
import { createAppSlice } from './slices/appSlice';
import { createOrderSlice } from './slices/orderSlice';
import { createAdminProductSlice } from './slices/adminProductSlice';
import { createAdminCollectionSlice } from './slices/adminCollectionSlice'; // Import the new admin collection slice
import { createSettingsSlice } from './slices/settingsSlice';

const useStore = create((...a) => ({
  ...createProductSlice(...a),
  ...createCartSlice(...a),
  ...createAuthSlice(...a),
  ...createWishlistSlice(...a),
  ...createAppSlice(...a),
  ...createOrderSlice(...a),
  ...createAdminProductSlice(...a),
  ...createAdminCollectionSlice(...a), // Add the admin collection slice
  ...createSettingsSlice(...a),
}));

export default useStore;
