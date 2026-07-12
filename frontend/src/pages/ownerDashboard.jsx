import React from "react";
import { motion } from "framer-motion";
import { getAssetsManagerDashboard } from "../api/assetManagerDashboardAPI.js";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  Grid,
  Box,
  Map,
  Calendar,
  Wrench,
  Shield,
  FileText,
  Bell,
  Settings,
  Activity,
  Search,
  Package,
  CheckSquare,
  Layers,
} from "lucide-react";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardAPI.js";
import { sidebarMenu } from "../config/sidebarMenu";
// --- Dummy Data (Matching the Image) ---

const lineData = [
  { name: "Mon", Allocated: 170, Returned: 60 },
  { name: "Tue", Allocated: 90, Returned: 140 },
  { name: "Wed", Allocated: 60, Returned: 90 },
  { name: "Thu", Allocated: 110, Returned: 100 },
  { name: "Fri", Allocated: 130, Returned: 60 },
  { name: "Sat", Allocated: 170, Returned: 100 },
  { name: "Sun", Allocated: 130, Returned: 90 },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const cardHoverProps = {
  whileHover: {
    scale: 1.02,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

export default function OwnerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  //   console.log("Dashboard Stats:", stats);
  const [profile, setProfile] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const getLetters = (value) => {
    if (!value) return "U";

    return value
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();

        setProfile(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const donutData =
    stats?.statusGraph?.map((item) => {
      let color = "#3b82f6";

      switch (item.name) {
        case "Available":
          color = "#2dd4bf";
          break;

        case "Allocated":
          color = "#3b82f6";
          break;

        case "Maintenance":
          color = "#fbbf24";
          break;

        case "Lost":
          color = "#ef4444";
          break;

        case "Scrapped":
          color = "#6b7280";
          break;

        default:
          color = "#a855f7";
      }

      return {
        ...item,
        color,
      };
    }) || [];

  const barData =
    stats?.categoryGraph?.map((item) => ({
      name: item.name,
      count: item.value,
    })) || [];

  const filteredActivities =
    stats?.recentActivities?.filter((asset) =>
      asset.assetName.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  if (loading) {
    return <h2>Loading Dashboard...</h2>;
  }
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-[#1e1b4b] text-white flex flex-col"
      >
        <div className="p-6 flex items-center space-x-3">
          <div className="bg-purple-600 p-2 rounded-lg">
            <Box size={20} />
          </div>
          <span className="text-xl font-bold">AssetFlow</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 ">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: Users, label: "Departments" },
            { icon: Users, label: "Employees" },
            { icon: Grid, label: "Asset Categories" },
            { icon: Box, label: "Assets" },
            { icon: Map, label: "Allocation" },
            { icon: Calendar, label: "Bookings" },
            { icon: Wrench, label: "Maintenance" },
            { icon: Shield, label: "Audit" },
            { icon: FileText, label: "Reports" },
            { icon: Bell, label: "Notifications", badge: 12 },
            { icon: Settings, label: "System Settings" },
            { icon: Activity, label: "Activity Logs" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.1)" }}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${item.active ? "bg-purple-600" : "hover:bg-white/5"}`}
            >
              <div className="flex items-center space-x-3 text-sm">
                <item.icon
                  size={18}
                  className={item.active ? "text-white" : "text-gray-400"}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-purple-600 text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center w-96 bg-gray-100 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none ml-2 w-full text-sm"
            />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 bg-[#4c1d95] text-white px-8 py-2 rounded-b-xl font-bold tracking-wider top-0">
            ADMIN DASHBOARD
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-full transition-all duration-300 ${
                  showNotifications
                    ? "bg-purple-100 text-purple-600 scale-110"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Bell size={20} />

                <span className="absolute top-1 right-1 bg-pink-500 w-2 h-2 rounded-full"></span>
              </button>

              {showNotifications && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="
        absolute 
        right-0 
        mt-3
        w-80
        bg-white
        rounded-xl
        shadow-xl
        border
        border-gray-100
        p-4
        z-50
      "
                >
                  <h3 className="font-bold text-gray-800 mb-3">
                    Notifications
                  </h3>

                  {stats?.notifications?.length > 0 ? (
                    stats.notifications.map((notif, index) => (
                      <div
                        key={index}
                        className="
              flex
              items-center
              gap-3
              p-3
              rounded-lg
              hover:bg-gray-50
              cursor-pointer
              transition
            "
                      >
                        <div
                          className="
              w-8
              h-8
              rounded-full
              bg-purple-100
              flex
              items-center
              justify-center
            "
                        >
                          <Bell size={14} className="text-purple-600" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold">{notif.msg}</p>

                          <p className="text-xs text-gray-400">{notif.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No notifications</p>
                  )}
                </motion.div>
              )}
            </div>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">
                  {getLetters(profile?.name)}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-800">{profile?.email}</p>

                <p className="text-xs text-gray-500">{profile?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-y-auto p-6 bg-gray-50/50"
        >
          {/* STATS CARDS */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {[
              {
                title: "Total Assets",
                value: stats?.totalAssets ?? 0,
                change: "",
                color: "text-green-500",
                icon: Package,
                bg: "bg-purple-100",
                iconColor: "text-purple-600",
              },
              {
                title: "Allocated Assets",
                value: stats?.allocatedAssets ?? 0,
                change: "",
                color: "text-green-500",
                icon: CheckSquare,
                bg: "bg-pink-100",
                iconColor: "text-pink-600",
              },
              {
                title: "Available Assets",
                value: stats?.availableAssets ?? 0,
                change: "",
                color: "text-blue-500",
                icon: Layers,
                bg: "bg-green-100",
                iconColor: "text-green-600",
              },
              {
                title: "Total Employees",
                value: stats?.totalEmployees ?? 0,
                change: "",
                color: "text-blue-500",
                icon: Users,
                bg: "bg-blue-100",
                iconColor: "text-blue-600",
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                {...cardHoverProps}
                className="bg-white p-5 rounded-xl border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-bold mt-1 text-gray-800">
                      {stat.value}
                    </h3>
                  </div>
                  <div
                    className={`p-3 rounded-xl ${stat.bg} ${stat.iconColor}`}
                  >
                    <stat.icon size={24} />
                  </div>
                </div>
                <p className={`text-xs font-semibold ${stat.color}`}>
                  {stat.change}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CHARTS ROW 1 */}
          <div className="grid grid-cols-3 gap-6 mb-6 h-80">
            {/* Donut Chart */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-xl border border-gray-100 col-span-1"
            >
              <h3 className="text-md font-bold mb-4">Asset Status Overview</h3>
              <div className="h-full relative">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text for Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-10">
                  <span className="text-2xl font-bold">
                    {stats?.totalAssets ?? 0}
                  </span>
                  <span className="text-xs text-gray-500">Total</span>
                </div>
              </div>
            </motion.div>

            {/* Bar Chart */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-xl border border-gray-100 col-span-2"
            >
              <h3 className="text-md font-bold mb-4">Assets by Category</h3>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart
                  data={barData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eee"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#888" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#888" }}
                  />
                  <RechartsTooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          [
                            "#7c3aed",
                            "#2dd4bf",
                            "#fbbf24",
                            "#3b82f6",
                            "#14b8a6",
                          ][index % 5]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* CHARTS ROW 2 */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Recent Activities */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-xl border border-gray-100 col-span-1 h-96 overflow-y-auto"
            >
              <h3 className="text-md font-bold mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {stats?.recentActivities?.length > 0 ? (
                  filteredActivities.map((asset) => (
                    <div
                      key={asset._id}
                      className="flex items-start space-x-3 border-b border-gray-50 pb-3 last:border-0"
                    >
                      <div className="mt-1 text-purple-600">
                        <Box size={16} />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {asset.assetName}
                        </p>

                        <p className="text-xs text-gray-500">
                          Asset ID: {asset.assetId}
                        </p>

                        <span
                          className={`text-xs font-semibold ${
                            asset.status === "Available"
                              ? "text-green-600"
                              : asset.status === "Allocated"
                                ? "text-blue-600"
                                : asset.status === "Maintenance"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                          }`}
                        >
                          {asset.status}
                        </span>
                      </div>

                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No recent activities found.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Line Chart */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-xl border border-gray-100 col-span-1 h-96"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-bold">Asset Allocation Trend</h3>
                <div className="flex space-x-3 text-xs">
                  <span className="flex items-center text-purple-600">
                    <span className="w-2 h-2 rounded-full bg-purple-600 mr-1"></span>{" "}
                    Allocated
                  </span>
                  <span className="flex items-center text-green-500">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>{" "}
                    Returned
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart
                  data={lineData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eee"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#888" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#888" }}
                  />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="Allocated"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#7c3aed" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Returned"
                    stroke="#2dd4bf"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#2dd4bf" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* System Notifications */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-xl border border-gray-100 col-span-1 h-96 overflow-y-auto"
            >
              <h3 className="text-md font-bold mb-4">System Notifications</h3>
              {stats?.notifications?.map((notif, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notif.type === "danger"
                        ? "bg-red-100 text-red-500"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <Bell size={14} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {notif.msg}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400">{notif.time}</span>
                </div>
              ))}
              <button className="w-full mt-6 text-sm text-blue-600 font-semibold hover:underline">
                View all notifications
              </button>
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
