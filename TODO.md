# Admin Panel Issues Fix

## Tasks
- [x] Import `protectRoute` in `admin.routes.js`
- [x] Update all existing admin routes to use `protectRoute` before `protectAdminRoute`
- [x] Add product management routes: GET /products, POST /products, PUT /products/:id, DELETE /products/:id
- [x] Add order management routes: GET /orders, PUT /orders/:id/status
- [x] Add coupon management routes: GET /coupons, POST /coupons, PUT /coupons/:id, DELETE /coupons/:id

## Summary
- Fixed admin authorization by adding `protectRoute` middleware before `protectAdminRoute` on all admin routes.
- Added missing admin routes for products, orders, and coupons using existing controller functions.
- Admin ID seeded with role 'admin' should now be properly authorized.
- Admin panel should now have access to manage products, orders, and coupons.
