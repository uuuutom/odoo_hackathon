import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      unique: true,
      required: true,
    },

    assetName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Laptop",
        "Desktop",
        "Furniture",
        "Vehicle",
        "Electronics",
        "Others",
      ],
    },

    brand: String,

    model: String,

    serialNumber: {
      type: String,
      unique: true,
    },

    purchaseDate: Date,

    purchasePrice: Number,

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["Available", "Allocated", "Maintenance", "Lost", "Scrapped"],
      default: "Available",
    },

    condition: {
      type: String,
      enum: ["New", "Good", "Fair", "Poor"],
      default: "New",
    },

    image: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Asset", assetSchema);
