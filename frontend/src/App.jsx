import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setUserData, setAllUsers, setAllComponents } from "./redux/userSlice";

import LoginView from "./pages/LoginView";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import ForgotPassword from "./pages/ForgetPassword.jsx";
import CreateNewPassword from "./pages/CreateNewPaaword.jsx";

export const ServerUrl = "http://localhost:3088";

function App() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [authChecked, setAuthChecked] = useState(false);

  // ==========================================
  // Check Login
  // ==========================================
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/user/current-user`, {
          withCredentials: true,
        });

        dispatch(setUserData(res.data));
      } catch (err) {
        dispatch(setUserData(null));
      } finally {
        setAuthChecked(true);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  // ==========================================
  // Optional Admin Data
  // ==========================================
  useEffect(() => {
    if (!userData) return;

    if (userData.role !== "admin") return;

    const loadData = async () => {
      try {
        const users = await axios.get(`${ServerUrl}/api/user/all-users`, {
          withCredentials: true,
        });

        dispatch(setAllUsers(users.data));
      } catch {
        dispatch(setAllUsers([]));
      }

      try {
        const components = await axios.get(
          `${ServerUrl}/api/component/all-components`,
          {
            withCredentials: true,
          },
        );

        dispatch(setAllComponents(components.data));
      } catch {
        dispatch(setAllComponents([]));
      }
    };

    loadData();
  }, [userData, dispatch]);

  // ==========================================
  // Loading
  // ==========================================
  if (!authChecked) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/verify-otp" element={<VerifyOTP />} />

      <Route path="/forget-password" element={<ForgotPassword />} />

      <Route path="/create-new-password" element={<CreateNewPassword />} />

      {/* Login */}
      <Route
        path="/login"
        element={
          userData ? <Navigate to="/dashboard" replace /> : <LoginView />
        }
      />

      {/* sign in  */}
      <Route
        path="/signin"
        element={userData ? <Navigate to="/dashboard" replace /> : <Signin />}
      />

      <Route path="/dashboard" element={<Dashboard />} />

      {/* Admin */}
      {/* <Route
        path="/owner-dashboard"
        element={
          userData?.role === "admin" ? (
            <OwnerDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      /> */}

      {/* 404 */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}

export default App;
