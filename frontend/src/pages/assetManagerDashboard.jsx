import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAssetsManagerDashboard } from "../api/assetManagerDashboardAPI";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  LayoutDashboard,
  Box,
  Users,
  ArrowRightLeft,
  Calendar,
  Wrench,
  ShieldCheck,
  FileText,
  Building2,
  Tags,
  Bell,
  Settings,
  Search,
  Menu,
  CheckCircle,
  AlertCircle,
  ClipboardList,
  RefreshCcw,
  Monitor,
} from "lucide-react";

export default function AssetManagerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  const statusData =
    dashboardData?.statusData?.map((item) => ({
      name: item._id,
      value: item.value,
    })) || [];

  const trendData = dashboardData?.trendData || [];

  const categoryData =
    dashboardData?.categoryData?.map((item) => ({
      name: item._id,
      value: item.value,
    })) || [];

  const maintenanceData =
    dashboardData?.maintenanceData?.map((item) => ({
      name: item._id,
      count: item.count,
    })) || [];

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
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const getzletters = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getAssetsManagerDashboard();

        setDashboardData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  const upcomingReturns = dashboardData?.upcomingReturns || [];
  const recentRequests = dashboardData?.recentRequests || [];
  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-[#064e3b] text-slate-300 flex flex-col shadow-xl z-20"
      >
        <div className="p-6 flex items-center space-x-3 mb-2">
          <div className="bg-emerald-500 p-2 rounded-lg text-white">
            <Box size={20} />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">
            AssetFlow
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: Box, label: "Assets" },
            { icon: Users, label: "Allocation" },
            { icon: ArrowRightLeft, label: "Transfer Requests", badge: 5 },
            { icon: Calendar, label: "Bookings" },
            { icon: Wrench, label: "Maintenance", badge: 3 },
            { icon: ShieldCheck, label: "Audit" },
            { icon: FileText, label: "Reports" },
            { icon: Users, label: "Employees" },
            { icon: Building2, label: "Departments" },
            { icon: Tags, label: "Categories" },
            { icon: Bell, label: "Notifications", badge: 0 },
            { icon: Settings, label: "Settings" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{
                x: 4,
                backgroundColor: item.active ? "" : "rgba(255,255,255,0.05)",
              }}
              className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${item.active ? "bg-emerald-600 text-white shadow-md" : "hover:text-white"}`}
            >
              <div className="flex items-center space-x-3 text-sm font-medium">
                <item.icon
                  size={18}
                  className={item.active ? "text-white" : "text-emerald-100/70"}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${item.badge > 0 ? "bg-red-500 text-white" : "bg-emerald-800 text-emerald-200"}`}
                >
                  {item.badge}
                </span>
              )}
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4">
            <Menu
              size={20}
              className="text-slate-400 cursor-pointer hover:text-slate-600"
            />
            <div className="flex items-center w-80 bg-slate-100 rounded-lg px-3 py-2 border border-slate-200/50 focus-within:border-emerald-400 focus-within:bg-white transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search assets, people..."
                className="bg-transparent border-none outline-none ml-2 w-full text-sm placeholder-slate-400"
              />
            </div>
          </div>

          {/* Top Center Badge */}
          <div className="absolute left-1/2 -translate-x-1/2 bg-[#166534] text-white px-8 py-2 rounded-b-xl font-bold tracking-wider text-sm top-0 shadow-md">
            ASSET MANAGER DASHBOARD
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative cursor-pointer">
              <Bell
                size={20}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              />
              <span className="absolute -top-1 -right-1 bg-red-500 border-2 border-white w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                1
              </span>
            </div>
            <div className="flex items-center space-x-3 cursor-pointer pl-4 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-emerald-100 overflow-hidden border border-slate-200">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amit"
                  alt="Amit Kumar"
                />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-800 leading-tight">
                  Amit Kumar
                </p>
                <p className="text-[11px] text-slate-500">Asset Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-y-auto p-6"
        >
          {/* TOP STATS CARDS */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            {[
              {
                title: "Total Assets",
                value: dashboardData?.totalAssets || 0,
                stat: "+12.5% this month",
                statColor: "text-emerald-500",
                icon: Box,
                iconBg: "bg-emerald-50 text-emerald-500",
              },

              {
                title: "Allocated",
                value:
                  dashboardData?.statusData?.find(
                    (item) => item._id === "Allocated",
                  )?.value || 0,
                stat: dashboardData?.totalAssets
                  ? `${(
                      (dashboardData.statusData.find(
                        (item) => item._id === "Allocated",
                      )?.value /
                        dashboardData.totalAssets) *
                      100
                    ).toFixed(1)}%`
                  : "0%",
                statColor: "text-slate-400",
                icon: Users,
                iconBg: "bg-emerald-50 text-emerald-500",
              },

              {
                title: "Available",
                value:
                  dashboardData?.statusData?.find(
                    (item) => item._id === "Available",
                  )?.value || 0,
                stat: dashboardData?.totalAssets
                  ? `${(
                      (dashboardData.statusData.find(
                        (item) => item._id === "Available",
                      )?.value /
                        dashboardData.totalAssets) *
                      100
                    ).toFixed(1)}%`
                  : "0%",
                statColor: "text-slate-400",
                icon: CheckCircle,
                iconBg: "bg-emerald-50 text-emerald-500",
              },

              {
                title: "Maintenance",
                value:
                  dashboardData?.statusData?.find(
                    (item) => item._id === "Maintenance",
                  )?.value || 0,
                stat: dashboardData?.totalAssets
                  ? `${(
                      (dashboardData.statusData.find(
                        (item) => item._id === "Maintenance",
                      )?.value /
                        dashboardData.totalAssets) *
                      100
                    ).toFixed(1)}%`
                  : "0%",
                statColor: "text-slate-400",
                icon: Wrench,
                iconBg: "bg-red-50 text-red-500",
              },

              {
                title: "Overdue Assets",
                value: dashboardData?.overdueAssets || 0,
                stat: "1.0%",
                statColor: "text-slate-400",
                icon: AlertCircle,
                iconBg: "bg-red-50 text-red-500",
              },

              {
                title: "Pending Requests",
                value: dashboardData?.pendingRequests || 0,
                stat: "+2 new",
                statColor: "text-emerald-500",
                icon: ClipboardList,
                iconBg: "bg-indigo-50 text-indigo-500",
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                {...cardHoverProps}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[12px] font-semibold text-slate-600 leading-tight">
                    {card.title}
                  </p>
                  <div className={`p-1.5 rounded-lg ${card.iconBg}`}>
                    <card.icon size={16} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {card.value}
                  </h3>
                  <p
                    className={`text-[10px] font-semibold mt-1 ${card.statColor}`}
                  >
                    {card.stat}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* MIDDLE CHARTS ROW */}
          <div className="grid grid-cols-3 gap-6 mb-6 h-80">
            {/* Donut Chart (Asset Status) */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col"
            >
              <h3 className="text-sm font-bold text-slate-800 mb-2">
                Asset Status Distribution
              </h3>
              <div className="flex-1 flex items-center">
                <div className="w-1/2 h-full relative flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold text-slate-800">
                      1,248
                    </span>
                    <span className="text-[9px] font-semibold text-slate-500">
                      Total Assets
                    </span>
                  </div>
                </div>
                {/* Legend */}
                <div className="w-1/2 pl-2 flex flex-col justify-center space-y-3">
                  {statusData.map((item, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="flex items-center text-[11px] font-medium text-slate-700">
                        <span
                          className="w-2.5 h-2.5 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        {item.name}
                      </div>
                      <span className="text-[10px] text-slate-400 ml-4.5">
                        {item.value} ({((item.value / 1248) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Line Chart (Monthly Allocation vs Return) */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-800">
                  Monthly Allocation vs Return
                </h3>
                <div className="flex space-x-3 text-[10px] font-medium">
                  <span className="flex items-center text-emerald-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>{" "}
                    Allocated
                  </span>
                  <span className="flex items-center text-blue-500">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>{" "}
                    Returned
                  </span>
                </div>
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Line
                      type="linear"
                      dataKey="Allocated"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#22c55e" }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="linear"
                      dataKey="Returned"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#3b82f6" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Pie Chart (Top Categories) */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col"
            >
              <h3 className="text-sm font-bold text-slate-800 mb-2">
                Top Asset Categories
              </h3>
              <div className="flex-1 flex items-center">
                <div className="w-[55%] h-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        dataKey="value"
                        stroke="#fff"
                        strokeWidth={2}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-[45%] flex flex-col justify-center space-y-3 pl-2">
                  {categoryData.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-[11px]"
                    >
                      <div className="flex items-center text-slate-700 font-medium">
                        <span
                          className="w-2.5 h-2.5 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        {item.name}
                      </div>
                      <span className="font-bold text-slate-600">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* BOTTOM ROW (LISTS & BAR CHART) */}
          <div className="grid grid-cols-3 gap-6 h-[22rem]">
            {/* Recent Requests */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col"
            >
              <h3 className="text-sm font-bold text-slate-800 mb-5">
                Recent Requests
              </h3>
              <div className="flex-1 space-y-4">
                {recentRequests.map((req, i) => (
                  <div
                    key={req._id || i}
                    className="flex items-center justify-between group cursor-pointer border-b border-slate-50 pb-3 last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          req.requestType === "Maintenance"
                            ? "text-red-500 bg-red-50"
                            : req.requestType === "Return"
                              ? "text-blue-500 bg-blue-50"
                              : "text-emerald-500 bg-emerald-50"
                        }`}
                      >
                        {req.requestType === "Maintenance" ? (
                          <Wrench size={14} />
                        ) : req.requestType === "Return" ? (
                          <ArrowRightLeft size={14} />
                        ) : (
                          <RefreshCcw size={14} />
                        )}
                      </div>

                      <div>
                        <p className="text-[12px] font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors line-clamp-1">
                          {req.requestType} request for{" "}
                          {req.asset?.assetName || "Asset"}
                        </p>

                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {req.requestedBy?.name || "User"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap ml-2 ${
                        req.status === "Pending"
                          ? "text-orange-600 bg-orange-50"
                          : req.status === "Approved"
                            ? "text-emerald-600 bg-emerald-50"
                            : "text-red-600 bg-red-50"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="text-xs text-blue-600 font-semibold mt-4 hover:underline text-left">
                View all requests
              </button>
            </motion.div>

            {/* Upcoming Returns */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col"
            >
              <h3 className="text-sm font-bold text-slate-800 mb-5">
                Upcoming Returns
              </h3>
              <div className="flex-1 space-y-4">
                {upcomingReturns.map((ret, i) => (
                  <div
                    key={ret._id || i}
                    className="flex items-center space-x-4 group cursor-pointer border-b border-slate-50 pb-3 last:border-0"
                  >
                    <div className="text-center min-w-[35px]">
                      <p className="text-sm font-bold text-slate-800">
                        {new Date(ret.returnDate).getDate()}
                      </p>

                      <p className="text-[10px] font-medium text-slate-500">
                        {new Date(ret.returnDate).toLocaleString("en-US", {
                          month: "short",
                        })}
                      </p>
                    </div>

                    <div className="w-[1.5px] h-8 bg-slate-200"></div>

                    <div className="flex-1">
                      <p className="text-[12px] font-semibold text-slate-700 group-hover:text-emerald-600">
                        {ret.asset?.assetName}
                      </p>

                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {ret.employee?.name}
                      </p>
                    </div>

                    <div className="p-1.5 rounded-full bg-emerald-50 text-emerald-500">
                      <Monitor size={12} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-xs text-blue-600 font-semibold mt-4 hover:underline text-left">
                View all
              </button>
            </motion.div>

            {/* Maintenance Summary */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col"
            >
              <h3 className="text-sm font-bold text-slate-800 mb-4">
                Maintenance Summary
              </h3>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={maintenanceData}
                    margin={{ top: 20, right: 10, left: -25, bottom: 0 }}
                    barSize={35}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {maintenanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList
                        dataKey="count"
                        position="top"
                        fill="#475569"
                        fontSize={12}
                        fontWeight={700}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
