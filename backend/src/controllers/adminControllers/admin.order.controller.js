import Order from "../../models/order.model.js";

const VALID_STATUSES = [
  "Processing",
  "Confirmed",
  "Preparing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Returned",
];

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email")
      .populate("items.productId", "name image");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "fullName email")
      .populate("items.productId", "name image");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error in getOrderById:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;

    // Append to status history
    order.statusHistory = [
      ...(order.statusHistory || []),
      {
        status,
        timestamp: new Date(),
        note: note || `Status changed to ${status}`,
      },
    ];

    await order.save();

    const updated = await Order.findById(id)
      .populate("userId", "fullName email")
      .populate("items.productId", "name image");

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
