import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowLeft,
  FiAtSign,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function Signin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      return alert("Please fill all fields");
    }

    try {
      setIsLoading(true);

      const { data } = await axios.post(
        `${ServerUrl}/api/auth/signup`,
        {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        },
      );

      console.log(data);

      setIsSuccess(true);

      alert("OTP sent successfully. Please verify your email.");

      navigate("/verify-otp", {
        state: {
          email: formData.email,
          type: "signup",
        },
      });
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Signup Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Deep Twilight Base Background
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] font-sans overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-100 relative p-4 sm:p-8">
      {/* =========================================
          ANIMATED BACKGROUND GLOWS
          ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Subtle Slate Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)]" />

        {/* Animated Orbs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-cyan-500/20 rounded-full blur-[120px] mix-blend-screen"
        />
      </div>

      {/* =========================================
          SIGN IN / SIGN UP CARD
          ========================================= */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#1e293b]/80 backdrop-blur-2xl border border-slate-700/50 shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-[32px] p-8 sm:p-10">
          {/* Back to Login Link (Top Left) */}
          <motion.button
            variants={itemVariants}
            whileHover={{ x: -5, color: "#22d3ee" }}
            className="flex items-center gap-2 text-slate-400 text-sm font-semibold mb-8 transition-colors"
            onClick={() => console.log("Navigate back to login")}
          >
            <FiArrowLeft className="w-4 h-4" /> Back to login
          </motion.button>

          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              Create an account
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Join Nexus platform today and start building the future.
            </p>
          </motion.div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="form"
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Name Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Name
                  </label>
                  <div className="relative group">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3.5 bg-[#0f172a]/60 border border-slate-700/50 rounded-2xl text-white font-medium placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
                    />
                  </div>
                </motion.div>

                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-[#0f172a]/60 border border-slate-700/50 rounded-2xl text-white font-medium placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
                    />
                  </div>
                </motion.div>

                {/* Username Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Username
                  </label>
                  <div className="relative group">
                    {/* Using FiAtSign to differentiate from the Full Name icon. Make sure to import it from react-icons/fi */}
                    <FiAtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="@johndoe"
                      className="w-full pl-11 pr-4 py-3.5 bg-[#0f172a]/60 border border-slate-700/50 rounded-2xl text-white font-medium placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3.5 bg-[#0f172a]/60 border border-slate-700/50 rounded-2xl text-white font-medium placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-4">
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 0 20px rgba(6,182,212,0.4)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Create Account"
                      )}
                    </span>
                  </motion.button>
                </motion.div>
              </motion.form>
            ) : (
              // Success State Animation
              <motion.div
                onClick={() => navigate("/main")}
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6"
                >
                  <FiCheckCircle className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Account Created!
                </h3>
                <p className="text-slate-400 mb-8">
                  Welcome aboard, {formData.name}. click Here for Explore
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Option */}
          {!isSuccess && (
            <motion.p
              variants={itemVariants}
              className="text-center text-sm text-slate-500 mt-8 font-medium"
            >
              Already have an account?{" "}
              <button
                onClick={() => console.log("Navigate to login")}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors focus:outline-none"
              >
                Log in here
              </button>
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
