import User from "../../models/user.model.js";
import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";

const parseRangeToStartDate = (range) => {
  // Supported: 7d, 30d, 90d, 12m (defaults to 7d)
  const now = new Date();
  const safe = typeof range === "string" ? range.trim().toLowerCase() : "7d";

  const match = safe.match(/^(\d+)([dm])$/);
  if (!match) {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return start;
  }

  const amount = Number(match[1]);
  const unit = match[2];
  const start = new Date(now);

  if (!Number.isFinite(amount) || amount <= 0) {
    start.setDate(start.getDate() - 7);
    return start;
  }

  if (unit === "d") {
    start.setDate(start.getDate() - amount);
    return start;
  }

  // months
  start.setMonth(start.getMonth() - amount);
  return start;
};

const formatDateKeyUTC = (d) => {
  // YYYY-MM-DD in UTC to keep grouping stable
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    .toISOString()
    .slice(0, 10);
};

export const getAnalytics = async (req, res) => {
  try {
    // console.log("Entering getAnalytics controller.");

    const totalUsers = await User.countDocuments();
    // console.log("Total Users:", totalUsers);

    const totalOrders = await Order.countDocuments();
    // console.log("Total Orders:", totalOrders);

    const totalProducts = await Product.countDocuments();
    // console.log("Total Products:", totalProducts);

    // Basic sales summary (e.g., total revenue from delivered orders)
    const salesSummary = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);
    const totalRevenue = salesSummary.length > 0 ? salesSummary[0].totalRevenue : 0;
    // console.log("Total Revenue (Delivered Orders):", totalRevenue);

    // You can add more complex analytics here, e.g.,
    // - Orders per month/day
    // - Top selling products
    // - User registration trends

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      // Add more analytics data here
    });
  } catch (error) {
    console.error("Error in getAnalytics:", error.message); // Log the specific error message
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRevenueAnalytics = async (req, res) => {
  try {
    const { range = "7d" } = req.query;
    const startDate = parseRangeToStartDate(range);

    const rows = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing dates (so the line chart doesn't look "broken")
    const byDay = new Map(rows.map((r) => [r._id, Number(r.revenue || 0)]));
    const out = [];
    const cursor = new Date(startDate);
    const end = new Date();
    cursor.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    while (cursor <= end) {
      const key = formatDateKeyUTC(cursor);
      out.push({ date: key, revenue: byDay.get(key) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    res.status(200).json(out);
  } catch (error) {
    console.error("Error in getRevenueAnalytics:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrdersByStatus = async (req, res) => {
  try {
    const rows = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(rows.map((r) => ({ status: r._id, count: r.count })));
  } catch (error) {
    console.error("Error in getOrdersByStatus:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUsersAnalytics = async (req, res) => {
  try {
    const { range = "7d" } = req.query;
    const startDate = parseRangeToStartDate(range);

    const rows = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing dates
    const byDay = new Map(rows.map((r) => [r._id, Number(r.count || 0)]));
    const out = [];
    const cursor = new Date(startDate);
    const end = new Date();
    cursor.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    while (cursor <= end) {
      const key = formatDateKeyUTC(cursor);
      out.push({ date: key, count: byDay.get(key) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    res.status(200).json(out);
  } catch (error) {
    console.error("Error in getUsersAnalytics:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const rows = await Product.aggregate([
      { $group: { _id: "$subCategory", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(rows.map((r) => ({ category: r._id, count: r.count })));
  } catch (error) {
    console.error("Error in getProductsByCategory:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
