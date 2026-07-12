import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // =========================
    // Basic Information
    // =========================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
    },

    // =========================
    // Profile Information
    // =========================

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================
    // OAuth Authentication
    // =========================

    googleId: {
      type: String,
      default: null,
    },

    githubId: {
      type: String,
      default: null,
    },

    provider: {
      type: String,
      enum: ["email", "google", "github"],
      default: "email",
    },

    // =========================
    // Organization Details
    // =========================

    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    role: {
      type: String,
      enum: ["EMPLOYEE", "ASSET_MANAGER", "ADMIN", "DEPARTMENT_HEAD"],
      default: "EMPLOYEE",
    },

    // =========================
    // AI Assistant Permission
    // =========================

    aiAccess: {
      type: Boolean,
      default: true,
    },

    // =========================
    // Account Status
    // =========================

    emailVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// =========================
// Indexes
// =========================

userSchema.index({ department: 1 });

userSchema.index({ role: 1 });

userSchema.index({ status: 1 });

export default mongoose.model("User", userSchema);
