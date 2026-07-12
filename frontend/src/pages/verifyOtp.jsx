import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiKey, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, type } = location.state;

  // Refs for auto-focusing OTP input boxes
  const inputRefs = useRef([]);

  // Auto-focus the first field on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle OTP input changes & auto-focus next box
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value !== "" && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Keep only the last character if a user types over an existing digit
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input if a digit is entered
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace to focus previous box
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  //  function to verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const otpString = otp.join("");

    if (otpString.length !== 6) {
      return alert("Please enter a valid 6-digit OTP");
    }

    try {
      setIsLoading(true);

      let url;

      if (type === "signup") {
        url = `${ServerUrl}/api/auth/verify-signup-otp`;
      } else if (type === "login") {
        url = `${ServerUrl}/api/auth/verify-login-otp`;
      } else if (type === "forgot-password") {
        url = `${ServerUrl}/api/auth/verify-forgot-password-otp`;
      }

      const { data } = await axios.post(
        url,
        {
          email,
          otp: otpString,
        },
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setIsSuccess(true);

        alert(data.message);

        if (type === "forgot-password") {
          navigate("/create-new-password", {
            state: {
              email,
            },
          });
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.log(error.response?.data);

      alert(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function for resending OTP
  //   const handleResendOTP = () => {
  //     // Prevent double clicking if loading
  //     if (isLoading) return;

  //     console.log("Resending OTP code...");
  //     // Clear inputs and refocus first input on resend
  //     setOtp(["", "", "", "", "", ""]);
  //     if (inputRefs.current[0]) inputRefs.current[0].focus();
  //   };

  const handleResendOTP = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      let url = "";

      if (type === "signup") {
        url = `${ServerUrl}/api/auth/resend-signup-otp`;
      } else if (type === "login") {
        url = `${ServerUrl}/api/auth/resend-login-otp`;
      } else if (type === "forgot-password") {
        url = `${ServerUrl}/api/auth/resend-forgot-password-otp`;
      }

      const { data } = await axios.post(
        url,
        { email },
        {
          withCredentials: true,
        },
      );

      alert(data.message);

      // Clear OTP boxes
      setOtp(["", "", "", "", "", ""]);

      // Focus first input
      inputRefs.current[0]?.focus();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#1e293b]/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 relative z-10"
      >
        {/* Header/Logo */}
        <div className="flex justify-center mb-6">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <FiKey className="text-white w-6 h-6" />
          </motion.div>
        </div>

        <div className="overflow-hidden relative">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="otp-step"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleVerifyOTP}
                className="flex flex-col gap-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Enter Security Code
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Please enter the 6-digit verification code sent to your
                    device.
                  </p>
                </div>

                {/* 6 Digit Input Boxes */}
                <div className="flex justify-between gap-2 my-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      pattern="\d*"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-black bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:bg-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading || otp.join("").length < 6}
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <FiRefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    "Verify OTP"
                  )}
                </motion.button>

                {/* Resend Action */}
                <div className="text-center mt-1">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-sm font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    Didn't receive a code? Resend
                  </button>
                </div>
              </motion.form>
            ) : (
              /* SUCCESS STATE */
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 gap-4 text-center"
                onClick={() => navigate("/main")}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <FiCheckCircle className="w-20 h-20 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
                </motion.div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Verified!
                </h2>
                <p className="text-slate-400 text-sm">
                  Access granted. Redirecting to your workspace...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
