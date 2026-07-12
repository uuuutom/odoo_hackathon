import User from "../models/userModel.js";
import redisClient from "../config/redis.js";
import { genToken } from "../config/token.js";
import {
  verifyOTP,
  getSignupData,
  deleteSignupData,
} from "../services/otpService.js";

export const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // ==============================
    // Validate Input
    // ==============================
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // ==============================
    // Verify OTP
    // ==============================
    const isValidOTP = await verifyOTP(email, otp);

    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // ==============================
    // Get Signup Data From Redis
    // ==============================
    const signupData = await getSignupData(email);

    if (!signupData) {
      return res.status(400).json({
        success: false,
        message: "Signup session expired",
      });
    }

    // ==============================
    // Prevent Duplicate Users
    // ==============================
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ==============================
    // Create User
    // ==============================
    const user = await User.create({
      ...signupData,
      provider: "email",
      emailVerified: true,
    });

    // ==============================
    // Remove Signup Data From Redis
    // ==============================
    await deleteSignupData(email);

    // ==============================
    // Generate JWT
    // ==============================
    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ==============================
    // Safe User Object
    // ==============================
    const safeUser = user.toObject();

    delete safeUser.password;

    // ==============================
    // Cache User
    // ==============================
    await redisClient.setEx(
      `user:${user._id}`,
      60 * 60 * 24,
      JSON.stringify(safeUser),
    );

    // ==============================
    // Response
    // ==============================
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
