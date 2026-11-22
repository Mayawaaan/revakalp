import mongoose from "mongoose";

const inventoryMovementSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    productCode: { type: String, default: "" },
    type: {
      type: String,
      enum: [
        "reserve",
        "release",
        "commit_web",
        "commit_pos",
        "admin_adjustment",
        "return_restock",
        "damage_writeoff",
      ],
      required: true,
    },
    quantityDeltaOnHand: { type: Number, default: 0 },
    quantityDeltaReserved: { type: Number, default: 0 },
    channel: {
      type: String,
      enum: ["web", "pos", "admin", "system"],
      default: "system",
    },
    referenceId: { type: String, default: "" },
    actorId: { type: String, default: "" },
    reason: { type: String, default: "" },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
  },
  { timestamps: true }
);

const InventoryMovement = mongoose.model("InventoryMovement", inventoryMovementSchema);
export default InventoryMovement;
