# REVAKALP Frontend — Phase 0 Audit & Baseline

Date: 2026-11-20  
Workspace: `frontend/` (React 19 + Vite 7 + Tailwind CSS v4 + Zustand v5 + React Router DOM v7)

## 1. Dependencies & Tooling Baseline

### Installed (`frontend/package.json`)
- **Framework & Routing:** `react@^19.1.1`, `react-dom@^19.1.1`, `react-router-dom@^7.11.0`
- **Styling:** `tailwindcss@^4.1.18`, `@tailwindcss/vite@^4.1.18`
- **State & Data:** `zustand@^5.0.10`, `axios@^1.13.2`
- **3D & Shaders:** `three@^0.184.0`, `@react-three/fiber@^9.6.1`, `@react-three/drei@^10.7.7`, `vite-plugin-glsl@^1.6.0`
- **Animation & Scroll:** `framer-motion@^12.29.2`, `lenis@^1.3.23`
- **UI & Charts:** `lucide-react@^0.562.0`, `recharts@^3.6.0`, `react-hot-toast@^2.6.0`, `web-vitals@^5.2.0`
- **Build & Lint:** `vite@^7.1.2`, `@vitejs/plugin-react@^5.0.0`, `eslint@^9.33.0`

### Missing / Scroll Driver Decision
- `gsap` is **not** installed in `package.json`; will be installed (`gsap`) for ScrollTrigger editorial motion in Phase 7 (or earlier if needed).
- `locomotive-scroll` is **not** installed (although unused `src/hooks/useLocoScroll.js` references it). Per specification, **Lenis (`src/hooks/useLenis.js`) will remain the sole scroll driver**; Locomotive Scroll will not be installed or initialized alongside Lenis.

### Environment Variables (`frontend/.env` — names only)
- `VITE_API_URL`
- `VITE_RAZORPAY_KEY`
- Dev proxy in `vite.config.js`: `/api` -> `https://revakalp-2461.onrender.com` (`assetsInclude: ['**/*.glb']`).

## 2. Baseline Build & Lint Results

- **`npm run build` (`vite build`):**
  - Note: Inside the restricted sandbox, Rollup's `fs.realpathSync.native` fails with `EPERM` on `index.html` / `src/main.jsx`. Running `vite build` outside the sandbox (`BypassSandbox: true`) **succeeded** in `29.65s`.
  - Baseline output: `dist/index.html` (0.46 kB), `dist/assets/lengha-FZpuoYUh.glb` (38.52 kB), `dist/assets/index-BxDiJypW.css` (74.17 kB), `dist/assets/index-CHyZQr7h.js` (**2,019.16 kB** / 568.68 kB gzipped — unsplit single bundle).
- **`npm run lint` (`eslint .`):**
  - Baseline has **29 preexisting problems (17 errors, 12 warnings)**:
    - Errors (`no-unused-vars` / `no-empty`): `glslMaterials.js` (`silkMat`), `CartTotal.jsx` (`totalAfterCouponDiscount`), `Navbar.jsx` (`setShowSearch`), `useApiHelper.js` (`newToken`, empty `catch`), `Admin.jsx` (`Icon`), `AdminDashboard.jsx` (`Icon`), `Analytics.jsx` (`Icon`), `Settings.jsx` (`Icon`), `ViewOrders.jsx` (`drawerLoading`), `ProductDetailsPage.jsx` (`Icon`), `adminProductSlice.js` (`get`), `adminTypeSlice.js` (`get`), `authSlice.js` (`get`, `error`), `paymentSlice.js` (`get`), `typeSlice.js` (`get`).
    - Warnings (`react-hooks/exhaustive-deps`): `App.jsx`, `useLocoScroll.js`, `AdminDashboard.jsx`, `ManageCollections.jsx`, `ManageCoupons.jsx`, `ManageTypes.jsx`, `UserManagement.jsx`, `ViewOrders.jsx`, `ExploreJobs.jsx`, `ProductDetailsPage.jsx`.

## 3. Existing Routes, Guards & Preservation Commitments

### Route Map (`src/App.jsx`)
- **Public:** `/`, `/shop`, `/shop/:category`, `/shop/:category/:type`, `/product/:productId`, `/cart`, `/contact`, `/about`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/explore-jobs`, `/privacy-policy`, `/terms-conditions`, `/delivery-information`, `/returns-exchanges`, `/faq`, `*` (`NotFound`).
- **Wrapped in `<ProtectedRoute />`:** `/place-order`, `/order-success`, `/orders`, `/track/:orderId`, `/my-profile`, `/wishlist`.
  - *Audit Note:* `src/components/globalComponents/ProtectedRoute.jsx` currently checks `if (!user) -> /login` AND `if (user.role !== 'admin') -> /`. Per instructions ("preserve every route/protection wrapper", "Do not weaken guards", "Verify no API route, payload, role check or endpoint was silently altered"), this check will NOT be silently altered; it is flagged here and in the final report for the owner.
- **Wrapped in `<AdminProtectedRoute />`:** `/admin` (index `AdminDashboard`), `/admin/products`, `/admin/users`, `/admin/orders`, `/admin/collections`, `/admin/coupons`, `/admin/types`, `/admin/analytics`, `/admin/images`, `/admin/settings`.

### API Contracts & Zustand Store (`src/store/store.js`)
- **HTTP Clients:** `src/utils/axiosInstance.js` (`baseURL: VITE_API_URL`, `withCredentials: true`, Bearer header from `localStorage.token`, auto-refresh queue on 401 via `/api/auth/refresh`), `src/hooks/useApiHelper.js` (`apiFetch` with singleton refresh and `isBlob` support), and `src/store/slices/paymentSlice.js` (`/api/payment/create-order`, `/api/payment/verify-payment`).
- **Store Slices & Endpoints:**
  - `authSlice` / `useAuth`: `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout`, `/api/auth/refresh`, `/api/auth/check`, `/api/auth/update-profile`, `/api/auth/forgot-password`, `/api/auth/verify-otp-reset`.
  - `productSlice` & `typeSlice`: `/api/products`, `/api/collections`, `/api/types/:category` (`saree`, `kurta`, `suit`).
  - `cartSlice`: `/api/cart`, `/api/cart/add`, `/api/cart/update`, `/api/cart/remove`, `/api/cart/clear`, `/api/cart/coupon/apply`, `/api/cart/coupon/remove`.
  - `wishlistSlice`: `/api/wishlist`, `/api/wishlist/add/:productId`, `/api/wishlist/remove/:productId`.
  - `orderSlice`: `/api/orders`, `/api/orders/place`, `/api/orders/:orderId`, `/api/orders/:orderId/track`, `/api/orders/reorder/:orderId`, `/api/orders/:orderId/invoice`.
  - `paymentSlice`: `/api/payment/create-order`, `/api/payment/verify-payment`.
  - `reviewSlice`: `/api/reviews/:productId`, `/api/reviews`.
  - `settingsSlice`: `/api/settings`, `/api/admin/settings`.
  - `admin*` slices & admin pages: `/api/admin/products`, `/api/admin/collections`, `/api/admin/types`, `/api/admin/orders`, `/api/admin/users`, `/api/admin/coupons`, `/api/admin/analytics*`.

### Data Model Fields (`backend/src/models/product.model.js`)
- `code`, `name`, `description`, `price`, `discount`, `discountedPrice`, `image` (`[String]` Cloudinary URLs; some frontend slices/components also check `images`), `category`, `subCategory`, `type`, `gender`, `state`, `hasSizes`, `sizes`, `stock`, `date`, `bestseller`, `print`, `exclusivity`.

## 4. Branding & Visual Asset Audit

- **Official Brand Suite (`Revakalp_Official_Brand_Antigravity_Kit/branding/`):**
  - Authoritative crossing-thread `REVAKALP` wordmark and `R` monogram, with `"WEAVING LIFE INTO TIME"` tagline in full primary lockups (`revakalp-primary-gold.svg`, `revakalp-primary-burgundy.svg`, `revakalp-primary-ivory.svg`) and compact wordmark without tiny tagline in header (`revakalp-header-burgundy.svg`, `revakalp-header-gold.svg`).
  - Verified against `branding/preview/revakalp-website-suite-preview.png`.
  - Official CSS tokens (`branding/developer/brand-tokens.css`): `#38131E` (`--revakalp-burgundy`), `#2B0E17` (`--revakalp-burgundy-deep`), `#D4AF63` (`--revakalp-gold`), `#F1D889` (`--revakalp-gold-highlight`), `#F7F1E5` (`--revakalp-ivory`), `#1A1718` (`--revakalp-ink`), `'EB Garamond', Georgia, serif` headings, `'Inter', Arial, sans-serif` body.
  - Supersedes all placeholder colors (`#5B0E2D`, `#F7F0E6`, `#C7A45A`, `#c9487c`, `#9c2756`, `#fff1f4`) and mockup fonts (`Playfair Display`, `Cormorant`, `Barlow`, `DM Sans`).
- **Existing Frontend Logo Assets (`frontend/public/`):**
  - Currently has `logo.png`, `smlogo.png`, `goldLogo.png`, `hero.png`, `heroImg.png`, `about.png`, `contact.png`, `razorpay.svg`, `upi.png`, `loader.mp4`.
  - `razorpay.svg` and `upi.png` must be retained for checkout payment UI.
  - `Navbar.jsx`, `Footer.jsx`, `index.html`, and `WebsiteLoader.jsx` will switch to official `/branding/...` SVG/icon assets.
- **Illustrative Kit Assets (`assets/`):**
  - `assets/hero/hero-editorial.png` and `assets/category-art/*.png` are illustrative artwork only (never presented as actual purchasable SKUs or physical store photographs).
  - `assets/design-references/*.png` are layout inspiration only and will NOT be shipped in the app or used as product photography.
- **3D Assets (`src/components/3d_Components/`):**
  - Preserves `src/assets/lengha.glb`, `New3D.jsx`, `Pod.jsx`, `glslMaterials.js`, and `shaders/*.js`. Existing shader palette (`#3d0030`, `#fce7f3`, `#9c2756`, `#c9487c`) will be harmoniously updated to the official `#38131E` / `#D4AF63` / `#F7F1E5` palette while preserving the lehenga GLB exhibit, pedestal, and interactive cloth physics.
- **Mobile Hero Gap:**
  - `src/components/homepage/Landing.jsx` currently returns `null` below `768px` (`if (width < 768) return null`). Will be replaced in Phase 2 with a responsive hybrid hero (LCP-safe campaign visual + mobile composition + lazy 3D on capable desktop viewports).
