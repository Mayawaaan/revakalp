import Order from "../../models/order.model.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("userId", "fullName email").populate("items.productId", "name image"); // Populate user info and product name/image
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status (you might want a more comprehensive list of valid statuses)
    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled", "Pending"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("userId", "fullName email").populate("items.productId", "name image");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
