import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import axios from "axios";
import { ServerUrl } from "../App";
import {
  OrbitControls,
  Float,
  Sphere,
  MeshDistortMaterial,
  Sparkles,
} from "@react-three/drei";

// --- FIREBASE IMPORTS ---
import {
  signInWithPopup,
  linkWithCredential,
  GithubAuthProvider,
  GoogleAuthProvider, // <-- ADD THIS
} from "firebase/auth";
import { auth, provider, githubProvider } from "../config/firebase"; // provider = GoogleAuthProvider
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../config/api"; // Your Axios config with credentials: true
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

// --- 3D Visual Component (Unchanged) ---
function AbstractHeroObject() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={2.5}
        color="#8b5cf6"
      />
      <directionalLight
        position={[-10, -10, -5]}
        intensity={1.5}
        color="#06b6d4"
      />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#6366f1" />

      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <Sphere args={[1.3, 64, 64]}>
          <MeshDistortMaterial
            color="#050816"
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.8}
            roughness={0.2}
            distort={0.4}
            speed={2}
          />
        </Sphere>
        <Sphere args={[1.5, 32, 32]} scale={1.05}>
          <meshBasicMaterial
            color="#6366f1"
            wireframe
            transparent
            opacity={0.1}
          />
        </Sphere>
      </Float>

      <Sparkles
        count={120}
        scale={12}
        size={1.5}
        speed={0.4}
        opacity={0.3}
        color="#8b5cf6"
      />
      <Sparkles
        count={80}
        scale={10}
        size={2}
        speed={0.6}
        opacity={0.2}
        color="#06b6d4"
      />
    </>
  );
}

export default function LoginView({ onLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  // Initialize React Router Navigation
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //otp
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return alert("Please fill all fields");
    }

    try {
      setIsLoading(true);

      const { data } = await axios.post(
        `${ServerUrl}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        },
      );

      console.log(data);
      console.log("Response:", data);

      setIsSuccess(true);

      alert("OTP sent successfully. Please verify your email.");

      navigate("/verify-otp", {
        state: {
          email: formData.email,
          type: "login",
        },
      });
    } catch (error) {
      console.log("=========== LOGIN ERROR ===========");
      console.log(error);
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
      console.log("Message:", error.message);

      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================
  // FUNCTION: GOOGLE FIREBASE SIGN IN
  // =========================================
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await api.post("/auth/google", {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        firebaseUid: user.uid,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Google Authentication Successful!");

        // Update Redux if your backend returns the user here too
        if (response.data.user) {
          dispatch(setUserData(response.data.user));
        }

        if (onLoginSuccess) onLoginSuccess(response.data);
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      toast.error(
        error.response?.data?.message || "Google authentication failed.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================
  // FUNCTION: GITHUB FIREBASE SIGN IN (WITH LINKING)
  // =========================================
  const handleGithubSignIn = async () => {
    setIsLoading(true);

    try {
      // 1. Attempt standard GitHub Login
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      // 2. Send user to backend
      const { data } = await api.post("/auth/github", {
        name:
          user.displayName || user.reloadUserInfo?.screenName || "GitHub User",
        email: user.email,
        photoURL: user.photoURL,
        githubId: user.uid,
      });

      dispatch(setUserData(data.user));
      toast.success("GitHub Login Successful");
      navigate("/main");
    } catch (error) {
      // 3. Handle specific error: Account exists with a different credential
      if (error.code === "auth/account-exists-with-different-credential") {
        const pendingCred = GithubAuthProvider.credentialFromError(error);
        const email = error.customData?.email; // Get the exact email

        try {
          toast.dismiss(); // Clear previous toasts
          toast.loading(`Email exists! Please verify ${email} with Google...`, {
            duration: 4000,
          });

          // Force Google to use the exact matching email to prevent mismatches
          const googleProvider = new GoogleAuthProvider();
          if (email) {
            googleProvider.setCustomParameters({ login_hint: email });
          }

          // Prompt the user to sign in with Google
          const googleResult = await signInWithPopup(auth, googleProvider);

          // Link the GitHub credential to the verified Google account
          await linkWithCredential(googleResult.user, pendingCred);

          toast.dismiss();
          toast.success("Accounts successfully linked!");

          // Send to backend after successful linking
          const linkedUser = googleResult.user;
          const { data } = await api.post("/auth/github", {
            name: linkedUser.displayName || "GitHub User",
            email: linkedUser.email,
            photoURL: linkedUser.photoURL,
            githubId: pendingCred.uid,
          });

          dispatch(setUserData(data.user));
          navigate("/dashboard");
        } catch (linkError) {
          console.error("Error linking accounts:", linkError);
          toast.dismiss();

          // Catch specific browser/user actions
          if (linkError.code === "auth/popup-blocked") {
            toast.error(
              "Browser blocked the popup! Please click the Google button to sign in first.",
            );
          } else if (linkError.code === "auth/popup-closed-by-user") {
            toast.error("Google verification was cancelled.");
          } else {
            toast.error("Failed to link. Please sign in with Google directly.");
          }
        }
      } else {
        // Handle generic errors (e.g., popup closed on the first GitHub try)
        console.error(error);
        toast.error(error.response?.data?.message || "GitHub Login Failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="flex min-h-screen w-full font-sans overflow-hidden bg-[#050816] relative text-white selection:bg-indigo-500/30">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#08111f",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />

      {/* BACKGROUND LAYERS */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-600/20 rounded-full blur-[128px] mix-blend-screen pointer-events-none animate-pulse duration-1000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-[128px] mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[128px] mix-blend-screen pointer-events-none" />

      {/* LEFT PANEL */}
      <div className="absolute left-0 top-0 w-full lg:w-1/2 h-full z-0 flex items-center justify-center pointer-events-auto">
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <AbstractHeroObject />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Canvas>
        </div>
      </div>

      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
            <div className="absolute inset-[1px] bg-[#050816] rounded-2xl z-0" />
            <svg
              className="w-6 h-6 text-white z-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 22h20L12 2z" />
            </svg>
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">
            Nexus <span className="text-indigo-400 font-medium">Platform</span>
          </span>
        </motion.div>

        <div className="max-w-md pb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-black text-white leading-tight mb-6 tracking-tight"
          >
            Build the future.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              Scale infinitely.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 font-medium leading-relaxed text-lg"
          >
            Access the central dashboard to manage internal routing, parse
            dynamic application data, and monitor real-time node execution.
          </motion.p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 relative z-20 w-full lg:w-1/2 lg:ml-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-[440px] mx-auto relative z-10 bg-[#08111f]/60 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-[32px] p-8 sm:p-10"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Systems Operational
            </span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="lg:hidden flex items-center gap-3 mb-10"
          >
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <div className="absolute inset-[1px] bg-[#050816] rounded-xl z-0" />
              <svg
                className="w-5 h-5 text-white z-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 2L2 22h20L12 2z" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Nexus
            </span>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Enter your credentials to access the workspace.
            </p>
          </motion.div>

          <form className="space-y-5">
            <motion.div variants={itemVariants}>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="you@company.com"
                className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-white font-medium placeholder-slate-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] disabled:opacity-50"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-400 uppercase tracking-wide"
                >
                  Password
                </label>
                <a
                  href="forget-password"
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-white font-medium placeholder-slate-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] disabled:opacity-50"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)",
                }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-2xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Sign In to Workspace"
                  )}
                </span>
              </motion.button>
            </motion.div>
          </form>

          <motion.div
            variants={itemVariants}
            className="flex items-center my-8"
          >
            <div className="flex-grow border-t border-white/[0.06]"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Or continue with
            </span>
            <div className="flex-grow border-t border-white/[0.06]"></div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-4"
          >
            <motion.button
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 bg-white/[0.02] text-slate-300 font-semibold py-3.5 px-4 border border-white/[0.08] rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.29 1.157 15.485 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c7.05 0 11.732-4.957 11.732-11.94 0-.803-.086-1.414-.188-1.755H12.24z"
                />
              </svg>
              Google
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGithubSignIn}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 bg-white/[0.02] text-slate-300 font-semibold py-3.5 px-4 border border-white/[0.08] rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#ffffff"
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                />
              </svg>
              GitHub
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/signin")}
              disabled={isLoading}
              className="col-span-2 flex items-center justify-center gap-3 bg-white/[0.02] text-slate-300 font-semibold py-3.5 px-4 border border-white/[0.08] rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Sign in with Email
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
