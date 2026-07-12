import User from "../models/userModel.js";
import { genToken } from "../config/token.js";
import redisClient from "../config/redis.js";
import bcrypt from "bcrypt";
import {
  createOTP,
  saveSignupData,
  verifyOTP,
} from "../services/otpService.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

//email-pass
import { signupSchema, loginSchema } from "../validation/authValidation.js";

// ==========================================
// GOOGLE AUTH
// ==========================================
export const googleAuth = async (req, res) => {
  try {
    console.log("STEP 1");

    const { name, email, photoURL, firebaseUid } = req.body;

    console.log("STEP 2");

    let user = await User.findOne({ email });

    console.log("STEP 3");

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: photoURL,
        firebaseUid,
      });
    }

    console.log("STEP 4");

    const token = await genToken(user._id);

    console.log("STEP 5");

    await redisClient.setEx(`user:${user._id}`, 86400, JSON.stringify(user));

    console.log("STEP 6");

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("STEP 7");

    return res.json(user);
  } catch (err) {
    console.log(err);
    console.log(err.stack);
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================================
// LOGOUT- GOOGLE
// ==========================================
export const logOut = async (req, res) => {
  try {
    if (req.userId) {
      await redisClient.del(`user:${req.userId}`);
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// signin- EMAIL
// ==========================================

export const signup = async (req, res) => {
  console.log("✅ SIGNUP CONTROLLER CALLED");
  try {
    const { error } = signupSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or Username already exists",
      });
    }

    console.log("1. Signup started");

    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("2. Password hashed");

    const otp = await createOTP(email);
    console.log("3. OTP created:", otp);

    await saveSignupData(email, {
      name,
      username,
      email,
      password: hashedPassword,
    });
    console.log("4. Signup data saved");

    try {
      await sendOTPEmail(email, otp);
      console.log("5. Email sent ✅");
    } catch (err) {
      console.error("❌ Email Error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      email,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// export const login = async (req, res) => {
//   console.log("========== LOGIN API ==========");

//   try {
//     // Validate Request
//     const { error } = loginSchema.validate(req.body);

//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details[0].message,
//       });
//     }

//     const { email, password } = req.body;

//     // Find User
//     const user = await User.findOne({
//       email: email.toLowerCase(),
//     });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // Check Provider
//     if (user.provider !== "email") {
//       return res.status(400).json({
//         success: false,
//         message: `This account uses ${user.provider} login. Please continue with ${user.provider}.`,
//       });
//     }

//     // Check Password Exists
//     if (!user.password) {
//       return res.status(400).json({
//         success: false,
//         message: "Password login is not available for this account.",
//       });
//     }

//     // Compare Password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // Check Account Status
//     if (!user.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: "Your account has been disabled.",
//       });
//     }

//     // Generate OTP
//     const otp = await createOTP(email);

//     // Send OTP Email
//     await sendOTPEmail(email, otp);

//     return res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//       email,
//     });
//   } catch (error) {
//     console.log("Login Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

//===========================================
//     github auth
//===========================================

export const login = async (req, res) => {
  console.log("========== LOGIN API ==========");

  try {
    // Validate Request
    const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check Login Provider
    if (user.provider !== "email") {
      return res.status(400).json({
        success: false,
        message: `This account uses ${user.provider} login. Please continue with ${user.provider}.`,
      });
    }

    // Check Password Exists
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Password login is not available for this account.",
      });
    }

    // Check Account Status
    if (user.status === "SUSPENDED") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended.",
      });
    }

    if (user.status === "INACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate OTP
    const otp = await createOTP(email);

    // Send OTP
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
      email,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const githubAuth = async (req, res) => {
  try {
    const { name, email, photoURL, githubId } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        username: email.split("@")[0],
        email,
        avatar: photoURL,
        githubId,
        provider: "github",
        emailVerified: true,
      });
    } else {
      user.githubId = githubId;
      user.provider = "github";

      if (photoURL) {
        user.avatar = photoURL;
      }

      user.lastLogin = new Date();

      await user.save();
    }

    const token = genToken(user._id);

    await redisClient.setEx(`user:${user._id}`, 86400, JSON.stringify(user));

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData = user.toObject();

    delete userData.password;

    return res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.log("GitHub Auth Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//==================================================
//  resend otp
//==================================================

export const resendSignupOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check pending signup exists
    const signupData = await getSignupData(email);

    if (!signupData) {
      return res.status(400).json({
        success: false,
        message: "Signup session expired. Please register again.",
      });
    }

    // Check user wasn't already created
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Account already exists. Please login.",
      });
    }

    // Generate new OTP
    const otp = await createOTP(email);

    // Send email
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend Signup OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// export const resendLoginOTP = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const user = await User.findOne({
//       email: email.toLowerCase(),
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//     if (user.status !== "ACTIVE") {
//       return res.status(403).json({
//         success: false,
//         message: "Your account has been disabled.",
//       });
//     }

//     if (user.status === "SUSPENDED") {
//       return res.status(403).json({
//         success: false,
//         message: "Your account has been suspended.",
//       });
//     }

//     if (user.status === "INACTIVE") {
//       return res.status(403).json({
//         success: false,
//         message: "Your account is inactive.",
//       });
//     }
//     const otp = await createOTP(email);

//     await sendOTPEmail(email, otp);

//     return res.status(200).json({
//       success: true,
//       message: "OTP resent successfully",
//     });
//   } catch (error) {
//     console.error("Resend Login OTP Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

export const resendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check account status
    if (user.status === "SUSPENDED") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended.",
      });
    }

    if (user.status === "INACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    // Safety check (for any unexpected status)
    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    // Generate OTP
    const otp = await createOTP(email);

    // Send OTP
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully.",
    });
  } catch (error) {
    console.error("Resend Login OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const isValidOTP = await verifyOTP(email, otp);

    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = genToken(user._id);

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Remove password
    const userResponse = user.toObject();
    delete userResponse.password;

    // Store session in Redis
    await redisClient.setEx(
      `user:${user._id}`,
      60 * 60 * 24,
      JSON.stringify(userResponse),
    );

    // Success Response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse,
    });
  } catch (error) {
    console.log("Verify Login OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const resendForgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = await createOTP(email);

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend Forgot Password OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//==========================================

export const forgotPassword = async (req, res) => {
  try {
    //email lay check kyru
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    //user chheck
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //otp create kyru and send kyru

    const otp = await createOTP(email);

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      email,
    });
  } catch (error) {}
};

export const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const isValidOTP = await verifyOTP(email, otp);

    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log("Verify Forgot Password OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    user.passwordChangedAt = new Date();

    await user.save();

    await redisClient.del(`user:${user._id}`);

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {}
};
