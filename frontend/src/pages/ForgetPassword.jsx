import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiCheckCircle,
  FiRefreshCw,
  FiArrowLeft,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP, 3 = Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Refs for auto-focusing OTP input boxes
  const inputRefs = useRef([]);

  // Auto-focus first input when reaching Step 2
  useEffect(() => {
    if (step === 2 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  // Mock function to simulate sending OTP
  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call to send recovery email
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  // Handle OTP input changes & auto-focus next box
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value !== "" && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return alert("Please enter your email");
    }

    try {
      setIsLoading(true);

      const { data } = await axios.post(
        `${ServerUrl}/api/auth/forgot-password`,
        { email },
        { withCredentials: true },
      );

      alert(data.message);

      navigate("/verify-otp", {
        state: {
          email,
          type: "forgot-password",
        },
      });
    } catch (error) {
      console.log("Forgot Password Error:", error);
      console.log("Response:", error.response);

      alert(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to verify OTP
  //   const handleVerifyOTP = (e) => {
  //     e.preventDefault();
  //     const otpString = otp.join("");
  //     if (otpString.length < 6) return;

  //     setIsLoading(true);
  //     // Simulate verification API call
  //     setTimeout(() => {
  //       setIsLoading(false);
  //       setStep(3); // Move to Success state
  //     }, 1500);
  //   };

  // Mock function for resending OTP
  //   const handleResendOTP = () => {
  //     if (isLoading) return;
  //     setOtp(["", "", "", "", "", ""]);
  //     if (inputRefs.current[0]) inputRefs.current[0].focus();
  //   };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" } },
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
        <div className="flex justify-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <FiLock className="text-white w-6 h-6" />
          </motion.div>
        </div>

        <div className="overflow-hidden relative">
          <AnimatePresence mode="wait">
            {/* STEP 1: EMAIL INPUT */}
            {step === 1 && (
              <motion.form
                key="email-step"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSendOTP}
                className="flex flex-col gap-6"
                onSubmit={handleSubmit}
              >
                <div className="text-center">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Forgot Password?
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Enter your registered email and we'll send you a 6-digit
                    security code to reset it.
                  </p>
                </div>

                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:bg-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading || !email}
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <FiRefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Send Recovery Code <FiArrowRight />
                    </>
                  )}
                </motion.button>

                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/login")} // Uncomment if using React Router
                    className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2 w-full"
                  >
                    <FiArrowLeft /> Back to Login
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 2: OTP INPUT */}
            {step === 2 && (
              <motion.form
                key="otp-step"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleVerifyOTP}
                className="flex flex-col gap-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Verify Identity
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Code sent to{" "}
                    <span className="text-cyan-400 font-medium">{email}</span>
                  </p>
                </div>

                {/* 6 Digit Input Boxes */}
                <div className="flex justify-between gap-2 mt-2">
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading || otp.join("").length < 6}
                  type="submit"
                  className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <FiRefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    "Verify Code"
                  )}
                </motion.button>

                <div className="flex items-center justify-between mt-2 px-1 text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Resend Code
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: SUCCESS STATE */}
            {step === 3 && (
              <motion.div
                key="success-step"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center py-8 gap-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <FiCheckCircle className="w-20 h-20 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
                </motion.div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Identity Verified!
                </h2>
                <p className="text-slate-400 text-sm">
                  Redirecting to create a new password...
                </p>

                {/* You can optionally add a button here to manually trigger the next step instead of auto-redirect */}
                {/* <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/reset-password')}
                  className="mt-6 w-full bg-slate-800 border border-slate-700 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                >
                  Continue
                </motion.button> */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
