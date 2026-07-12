import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ServerUrl } from "../App";

export default function CreateNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return alert("Please fill all fields");
    }

    try {
      setIsLoading(true);
      console.log(email);

      const { data } = await axios.post(
        `${ServerUrl}/api/auth/reset-password`,
        {
          email,
          password,
          confirmPassword,
        },
        {
          withCredentials: true,
        },
      );

      alert(data.message);

      navigate("/login");
    } catch (error) {
      console.log("Reset Password Error:", error);
      console.log("Response:", error.response);

      alert(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants for smooth transitions
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
        <div className="overflow-hidden relative">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="password-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
              >
                {/* Header */}
                <div className="flex justify-center mb-2">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                  >
                    <FiShield className="text-white w-6 h-6" />
                  </motion.div>
                </div>

                <div className="text-center mb-2">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Create New Password
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Your new password must be different from previous used
                    passwords.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl text-center font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                {/* New Password Input */}
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="New Password"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:bg-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Confirm Password Input */}
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Confirm New Password"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:bg-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading || !password || !confirmPassword}
                  type="submit"
                  className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <FiRefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </motion.button>
              </motion.form>
            ) : (
              /* SUCCESS STATE */
              <motion.div
                key="success-step"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center py-6 gap-5 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <FiCheckCircle className="w-20 h-20 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
                </motion.div>

                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Password Changed!
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Your password has been successfully reset. Click below to
                    log in seamlessly.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  // onClick={() => navigate('/login')} // Uncomment if using React Router
                  className="mt-4 w-full bg-slate-800 border border-slate-700 text-white py-3.5 rounded-xl font-bold hover:bg-slate-700 transition-colors shadow-lg"
                >
                  Back to Login
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
