import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  Box,
  Calendar,
  Wrench,
  FileText,
  Bell,
  Settings,
  Search,
  ChevronDown,
  ClipboardList,
  Monitor,
  CheckCircle,
  Clock,
  MoreVertical,
  Menu,
} from "lucide-react";

// --- Dummy Data ---
const categoryData = [
  { name: "Laptop", value: 40, color: "#3b82f6" }, // Blue
  { name: "Furniture", value: 20, color: "#38bdf8" }, // Light Blue
  { name: "Electronics", value: 15, color: "#2dd4bf" }, // Teal
  { name: "Vehicle", value: 15, color: "#fbbf24" }, // Yellow
  { name: "Others", value: 10, color: "#8b5cf6" }, // Purple
];

const allocationData = [
  { name: "Mon", value: 65 },
  { name: "Tue", value: 40 },
  { name: "Wed", value: 80 },
  { name: "Thu", value: 78 },
  { name: "Fri", value: 40 },
  { name: "Sat", value: 60 },
  { name: "Sun", value: 82 },
];

const utilizationData = [
  { name: "Used", value: 72, color: "#10b981" }, // Green
  { name: "Free", value: 28, color: "#f1f5f9" }, // Light Gray
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
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

export default function DepartmentHeadDashboard() {
  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-[#0f172a] text-slate-300 flex flex-col shadow-xl z-20"
      >
        <div className="p-6 flex items-center space-x-3 mb-4">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Box size={20} />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">
            AssetFlow
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: Box, label: "Department Assets" },
            { icon: Users, label: "Employees" },
            { icon: ClipboardList, label: "Allocation Requests", badge: 4 },
            { icon: Calendar, label: "Bookings" },
            { icon: Wrench, label: "Maintenance Requests", badge: 2 },
            { icon: FileText, label: "Reports" },
            { icon: Bell, label: "Notifications", badge: 5 },
            { icon: Settings, label: "Settings" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{
                x: 4,
                backgroundColor: item.active ? "" : "rgba(255,255,255,0.05)",
              }}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${item.active ? "bg-blue-600 text-white shadow-md shadow-blue-900/50" : "hover:text-white"}`}
            >
              <div className="flex items-center space-x-3 text-sm font-medium">
                <item.icon
                  size={18}
                  className={item.active ? "text-white" : "text-slate-400"}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
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
            <div className="flex items-center w-72 bg-slate-100 rounded-lg px-3 py-2 border border-slate-200/50 focus-within:border-blue-400 focus-within:bg-white transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none ml-2 w-full text-sm placeholder-slate-400"
              />
            </div>
          </div>

          {/* Top Center Badge */}
          <div className="absolute left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-b-xl font-bold tracking-wider text-sm top-0 shadow-md">
            DEPARTMENT HEAD DASHBOARD
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative cursor-pointer">
              <Bell
                size={20}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              />
              <span className="absolute -top-1 -right-1 bg-red-500 border-2 border-white w-3 h-3 rounded-full"></span>
            </div>
            <div className="flex items-center space-x-3 cursor-pointer pl-4 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-blue-100 overflow-hidden border border-slate-200">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Meera"
                  alt="Meera Joshi"
                />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-800 leading-tight">
                  Meera Joshi
                </p>
                <p className="text-[11px] text-slate-500">Department Head</p>
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
          {/* WELCOME SECTION */}
          <div className="flex justify-between items-end mb-6">
            <motion.div variants={itemVariants}>
              <h1 className="text-2xl font-bold text-slate-800">
                Welcome back, Meera Joshi 👋
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Here's what's happening in your department.
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-2 text-sm bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-slate-50"
            >
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-700">
                IT Department
              </span>
              <ChevronDown size={16} className="text-slate-400 ml-2" />
            </motion.div>
          </div>

          {/* KPI STATS CARDS */}
          <div className="grid grid-cols-5 gap-5 mb-6">
            {[
              {
                title: "Department Assets",
                value: "248",
                stat: "+10 this month",
                statColor: "text-blue-500",
                icon: Box,
                iconBg: "bg-blue-50 text-blue-600",
              },
              {
                title: "Allocated Assets",
                value: "180",
                stat: "72.6%",
                statColor: "text-blue-500",
                icon: Monitor,
                iconBg: "bg-emerald-50 text-emerald-500",
              },
              {
                title: "Available Assets",
                value: "60",
                stat: "24.2%",
                statColor: "text-emerald-500",
                icon: CheckCircle,
                iconBg: "bg-green-50 text-green-500",
              },
              {
                title: "Maintenance",
                value: "8",
                stat: "3.2%",
                statColor: "text-slate-500",
                icon: Wrench,
                iconBg: "bg-cyan-50 text-cyan-500",
              },
              {
                title: "Pending Requests",
                value: "6",
                stat: "+2 new",
                statColor: "text-blue-500",
                icon: ClipboardList,
                iconBg: "bg-red-50 text-red-500",
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                {...cardHoverProps}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <p className="text-[13px] font-medium text-slate-500 leading-tight w-24">
                    {card.title}
                  </p>
                  <div className={`p-2 rounded-lg ${card.iconBg}`}>
                    <card.icon size={18} />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold text-slate-800">
                    {card.value}
                  </h3>
                  <p
                    className={`text-[11px] font-semibold mt-1 ${card.statColor}`}
                  >
                    {card.stat}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CHARTS ROW */}
          <div className="grid grid-cols-4 gap-6 mb-6 h-[22rem]">
            {/* Donut Chart (Assets by Category) */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-1 flex flex-col"
            >
              <h3 className="text-sm font-bold text-slate-800 mb-2">
                Assets by Category
              </h3>
              <div className="flex-1 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
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
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-slate-800">248</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total
                  </span>
                </div>
              </div>
              {/* Custom Legend */}
              <div className="grid grid-cols-2 gap-y-2 mt-2">
                {categoryData.map((item, i) => (
                  <div key={i} className="flex items-center text-[11px]">
                    <span
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-slate-600 flex-1">{item.name}</span>
                    <span className="font-semibold text-slate-800">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Area Chart (Allocation Overview) */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-2 flex flex-col"
            >
              <h3 className="text-sm font-bold text-slate-800 mb-4">
                Allocation Overview
              </h3>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={allocationData}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
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
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      activeDot={{
                        r: 6,
                        fill: "#3b82f6",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Radial/Pie Chart (Department Utilization) */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-1 flex flex-col items-center justify-center text-center"
            >
              <h3 className="text-sm font-bold text-slate-800 w-full text-left mb-2">
                Department Utilization
              </h3>
              <div className="relative w-40 h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={utilizationData}
                      innerRadius={60}
                      outerRadius={75}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                    >
                      {utilizationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-800">72%</span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-emerald-500 font-bold text-sm">Good</h4>
                <p className="text-xs text-slate-500 mt-1 px-4 leading-relaxed">
                  You're utilizing assets efficiently.
                </p>
              </div>
            </motion.div>
          </div>

          {/* BOTTOM ROW (LISTS) */}
          <div className="grid grid-cols-3 gap-6">
            {/* Pending Allocation Requests */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
            >
              <h3 className="text-sm font-bold text-slate-800 mb-5">
                Pending Allocation Requests
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Laptop for John Doe",
                    date: "Requested on 20 May",
                    status: "Pending",
                    icon: Monitor,
                    bg: "bg-indigo-50 text-indigo-600",
                    badgeBg: "bg-orange-50 text-orange-600",
                  },
                  {
                    title: "Printer for Neha Verma",
                    date: "Requested on 21 May",
                    status: "Pending",
                    icon: Box,
                    bg: "bg-purple-50 text-purple-600",
                    badgeBg: "bg-orange-50 text-orange-600",
                  },
                ].map((req, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl ${req.bg}`}>
                        <req.icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {req.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {req.date}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${req.badgeBg}`}
                    >
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="text-sm text-blue-600 font-semibold mt-6 hover:underline">
                View all requests
              </button>
            </motion.div>

            {/* Recent Maintenance Requests */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
            >
              <h3 className="text-sm font-bold text-slate-800 mb-5">
                Recent Maintenance Requests
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Laptop LP-1016 overheating",
                    by: "Requested by Rahul Verma",
                    status: "Pending",
                    icon: Monitor,
                    bg: "bg-red-50 text-red-500",
                    badgeBg: "bg-orange-50 text-orange-600",
                  },
                  {
                    title: "WiFi Router not working",
                    by: "Requested by Ankit Singh",
                    status: "In Progress",
                    icon: Wrench,
                    bg: "bg-red-50 text-red-500",
                    badgeBg: "bg-blue-50 text-blue-600",
                  },
                ].map((req, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl ${req.bg}`}>
                        <req.icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {req.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {req.by}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${req.badgeBg}`}
                    >
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="text-sm text-blue-600 font-semibold mt-6 hover:underline">
                View all
              </button>
            </motion.div>

            {/* Upcoming Bookings */}
            <motion.div
              variants={itemVariants}
              {...cardHoverProps}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
            >
              <h3 className="text-sm font-bold text-slate-800 mb-5">
                Upcoming Bookings
              </h3>
              <div className="space-y-5">
                {[
                  {
                    date: "24 May",
                    time: "10:00 AM",
                    title: "Meeting Room A",
                    desc: "Team Standup",
                  },
                  {
                    date: "24 May",
                    time: "02:00 PM",
                    title: "Projector PR-12",
                    desc: "Client Presentation",
                  },
                ].map((book, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-4 group cursor-pointer"
                  >
                    <div className="text-center min-w-[50px]">
                      <p className="text-[12px] font-bold text-slate-800">
                        {book.date}
                      </p>
                      <p className="text-[10px] font-medium text-slate-500">
                        {book.time}
                      </p>
                    </div>
                    <div className="w-[2px] h-8 bg-slate-200 mt-1"></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {book.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {book.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-sm text-blue-600 font-semibold mt-6 hover:underline">
                View calendar
              </button>
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
