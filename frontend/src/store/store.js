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
import { createAdminTypeSlice } from './slices/adminTypeSlice';
import { createTypeSlice } from './slices/typeSlice';
import { createReviewSlice } from './slices/reviewSlice';
import { createPaymentSlice } from "./slices/paymentSlice";

const useStore = create((...a) => ({
    ...createPaymentSlice(...a),
  ...createProductSlice(...a),
  ...createCartSlice(...a),
  ...createAuthSlice(...a),
  ...createWishlistSlice(...a),
  ...createTypeSlice(...a),
  ...createAppSlice(...a),
  ...createOrderSlice(...a),
  ...createAdminProductSlice(...a),
  ...createAdminCollectionSlice(...a), // Add the admin collection slice
  ...createAdminTypeSlice(...a),
  ...createSettingsSlice(...a),
  ...createReviewSlice(...a),
}));

export default useStore;
