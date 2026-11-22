export const protectAdminRoute = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - Authentication required" });
  }
  if (req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Forbidden - Admin access required" });
};
