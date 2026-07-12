import mongoose from "mongoose";

const assetAllocationSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    allocatedDate: {
      type: Date,
      default: Date.now,
    },

    returnDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Allocated", "Returned", "Overdue"],
      default: "Allocated",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("AssetAllocation", assetAllocationSchema);
