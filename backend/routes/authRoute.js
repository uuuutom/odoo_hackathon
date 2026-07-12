import express from "express";

import {
  signup,
  login,
  googleAuth,
  githubAuth,
  logOut,
  resendSignupOTP,
  resendLoginOTP,
  resendForgotPasswordOTP,
  verifyLoginOTP,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
} from "../controllers/authController.js";
import { verifySignupOTP } from "../controllers/verifySignupOTP.js";

import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

// Email
router.post("/signup", signup);
router.post("/login", login);

// OAuth
router.post("/google", googleAuth);
router.post("/github", githubAuth);

// Logout
router.post("/logout", isAuth, logOut);

//otp-signin
router.post("/verify-signup-otp", verifySignupOTP);
router.post("/verify-login-otp", verifyLoginOTP);
router.post("/verify-forgot-password-otp", verifyForgotPasswordOTP);

//resend-otp
router.post("/resend-signup-otp", resendSignupOTP);
router.post("/resend-login-otp", resendLoginOTP);
router.post("/resend-forgot-password-otp", resendForgotPasswordOTP);

//forget-pass
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
