import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Monitor,
  Calendar,
  CheckSquare,
  Wrench,
  ArrowRightLeft,
  CornerDownLeft,
  Bell,
  User,
  Settings,
  Search,
  Menu,
  Laptop,
  CreditCard,
  Mouse,
  Clock,
  Plus,
  AlertCircle,
  CalendarDays,
  LogOut,
} from "lucide-react";
import { Zap } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ServerUrl } from "../App";
import { setUserData, setAllUsers, setAllComponents } from "../redux/userSlice";
// --- Spring Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

// Reusable interactive animation properties for cards and buttons
const interactiveSpring = {
  whileHover: {
    scale: 1.03,
    y: -4,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  whileTap: {
    scale: 0.97,
    y: 0,
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: { type: "spring", stiffness: 400, damping: 25 },
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

// --- Sub-components ---

const SidebarItem = ({ icon: Icon, label, badge, active, isLogout }) => (
  <motion.div
    whileHover={{
      x: 6,
      backgroundColor: isLogout
        ? "rgba(239, 68, 68, 0.1)"
        : "rgba(255, 255, 255, 0.1)",
    }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors ${
      active
        ? "bg-white/15 text-white shadow-inner"
        : isLogout
          ? "text-red-400 hover:text-red-300 mt-auto"
          : "text-gray-300 hover:text-white"
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className={active ? "text-purple-400" : ""} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge && (
      <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
        {badge}
      </span>
    )}
  </motion.div>
);

const SummaryCard = ({
  value,
  label,
  linkText,
  icon: Icon,
  iconColor,
  bgLight,
}) => (
  <motion.div
    variants={itemVariants}
    {...interactiveSpring}
    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-36 cursor-pointer"
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm text-gray-500 font-semibold mb-1">{label}</h3>
        <p className="text-3xl font-extrabold text-gray-800">{value}</p>
      </div>
      <div className={`p-2.5 rounded-xl ${bgLight} ${iconColor}`}>
        <Icon size={22} />
      </div>
    </div>
    <a
      href="#"
      className="text-xs text-purple-600 hover:text-purple-800 font-semibold transition-colors"
    >
      {linkText}
    </a>
  </motion.div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Overview");
  const { userData } = useSelector((state) => state.user);
  console.log("Redux userData:", userData);
  // Search state
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Profile dropdown state and ref for click-outside
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3088/api/user/current-user",
          {
            withCredentials: true,
          },
        );

        dispatch(setUserData(data));
      } catch (error) {
        console.error(error);
      }
    };

    getCurrentUser();
  }, [dispatch]);

  // Handle clicking outside the profile dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${ServerUrl}/api/auth/logout`,
        {},
        { withCredentials: true },
      );
      dispatch(setUserData(null));
      dispatch(setAllUsers(null));
      dispatch(setAllComponents(null));
      navigate("/login");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return (
    // Clean, modern light gray background
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden text-gray-800">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-64 bg-[#1e1040] text-white flex flex-col h-full shadow-2xl z-20"
      >
        <div className="p-6 flex items-center gap-3">
          <motion.div
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
          >
            <div className="w-4 h-4 border-2 border-white transform rotate-45 rounded-sm"></div>
          </motion.div>
          <span className="text-xl font-bold tracking-wide">AssetFlow</span>
        </div>

        <div className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
          <SidebarItem icon={Home} label="Dashboard" active={true} />
          <SidebarItem icon={Monitor} label="My Assets" />
          <SidebarItem icon={Plus} label="Book Resources" />
          <SidebarItem icon={Calendar} label="My Bookings" />
          <SidebarItem icon={Wrench} label="Maintenance Requests" />
          <SidebarItem icon={ArrowRightLeft} label="Transfer Requests" />
          <SidebarItem icon={CornerDownLeft} label="Return Requests" />
          <SidebarItem icon={Bell} label="Notifications" badge="3" />

          <div className="my-4 border-t border-white/10"></div>

          <SidebarItem icon={User} label="Profile" />
          <SidebarItem icon={Settings} label="Settings" />

          <div
            onClick={handleLogout}
            className="mt-auto pt-4 border-t border-white/10"
          >
            <SidebarItem icon={LogOut} label="Logout" isLogout={true} />
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 shadow-sm border-b border-gray-100 z-10 sticky top-0"
        >
          <div className="flex items-center gap-6 flex-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={22} />
            </motion.button>
            <div className="relative w-72 group">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search assets, bookings..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100/50 border border-transparent rounded-xl text-sm focus:outline-none focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="hidden md:block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-1.5 rounded-full shadow-md font-bold text-xs tracking-wider uppercase"
            >
              Employee Dashboard
            </motion.div>

            <div className="flex items-center gap-5">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="relative cursor-pointer text-gray-400 hover:text-purple-600 transition-colors p-2"
              >
                <Bell size={22} />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.5 }}
                  className="absolute top-1 right-1 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white"
                >
                  2
                </motion.span>
              </motion.div>
              <div className="h-8 w-px bg-gray-200"></div>

              <div className="relative" ref={profileRef}>
                <div
                  className="w-9 h-9 rounded-full bg-slate-800 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-bold text-sm cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:border-cyan-400 transition-colors"
                  onClick={() => setProfileOpen((prev) => !prev)}
                >
                  {getzletters(userData?.user?.name)}
                </div>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-3 w-64 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-slate-700/50 mb-2">
                        <p className="text-sm font-bold text-white truncate">
                          {userData?.user?.name || "Student"}
                        </p>
                        <p className="text-xs font-medium text-slate-400 truncate mt-0.5 capitalize">
                          {userData?.user?.role || "Student"}
                        </p>
                      </div>

                      {/* Remaining Credits Field (Highlighted) */}
                      <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-2xl p-3 flex items-center gap-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] mb-2">
                        <div className="p-2 bg-indigo-500/30 text-indigo-400 rounded-lg">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-indigo-300/80 uppercase tracking-wider">
                            Remaining Credits
                          </p>
                          <div className="flex items-baseline gap-1">
                            <p className="text-lg font-bold text-white">
                              {userData?.aiCredits !== undefined
                                ? userData.aiCredits
                                : 0}
                            </p>
                            <span className="text-xs font-medium text-indigo-300/60">
                              credits
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-pink-500 hover:bg-pink-500/10 hover:text-pink-400 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            {/* Welcome Section */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                Hello, {userData?.name || "Student"}
                <motion.span
                  animate={{ rotate: [0, 20, -10, 20, -10, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 4,
                  }}
                  className="text-3xl origin-bottom-right inline-block"
                >
                  👋
                </motion.span>
              </h1>
              <p className="text-gray-500 text-sm mt-1.5 font-medium">
                Here's your asset overview and latest activities.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="xl:col-span-2 space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <SummaryCard
                    value="3"
                    label="My Assets"
                    linkText="View details"
                    icon={Monitor}
                    iconColor="text-blue-600"
                    bgLight="bg-blue-50"
                  />
                  <SummaryCard
                    value="2"
                    label="Active Bookings"
                    linkText="View bookings"
                    icon={User}
                    iconColor="text-purple-600"
                    bgLight="bg-purple-50"
                  />
                  <SummaryCard
                    value="1"
                    label="Maintenance"
                    linkText="View status"
                    icon={Wrench}
                    iconColor="text-red-600"
                    bgLight="bg-red-50"
                  />
                  <SummaryCard
                    value="3"
                    label="Notifications"
                    linkText="Unread msgs"
                    icon={Bell}
                    iconColor="text-orange-600"
                    bgLight="bg-orange-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Calendar */}
                  <motion.div
                    variants={itemVariants}
                    {...interactiveSpring}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-default"
                  >
                    <h3 className="font-extrabold text-gray-800 mb-5">
                      My Booking Calendar
                    </h3>
                    <div className="text-center mb-5 flex justify-between items-center px-2">
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        className="text-gray-400 hover:text-purple-600 p-1"
                      >
                        &lt;
                      </motion.button>
                      <span className="font-bold text-sm text-gray-700">
                        May 2024
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        className="text-gray-400 hover:text-purple-600 p-1"
                      >
                        &gt;
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
                      <div>Su</div>
                      <div>Mo</div>
                      <div>Tu</div>
                      <div>We</div>
                      <div>Th</div>
                      <div>Fr</div>
                      <div>Sa</div>
                    </div>
                    <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center text-sm font-medium">
                      <div className="text-gray-300">28</div>
                      <div className="text-gray-300">29</div>
                      <div className="text-gray-300">30</div>
                      <div className="text-gray-300">1</div>
                      <div>2</div>
                      <div>3</div>
                      <div>4</div>
                      <div>5</div>
                      <div>6</div>
                      <div>7</div>
                      <div>8</div>
                      <div>9</div>
                      <div>10</div>
                      <div>11</div>
                      <div>12</div>
                      <div>13</div>
                      <div>14</div>
                      <div>15</div>
                      <div>16</div>
                      <div>17</div>
                      <div>18</div>
                      <div>19</div>
                      <div>20</div>
                      <div>21</div>
                      <div>22</div>
                      <div>23</div>
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        className="bg-purple-600 text-white w-8 h-8 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-purple-500/40 cursor-pointer font-bold"
                      >
                        24
                      </motion.div>
                      <div>25</div>
                      <div>26</div>
                      <div>27</div>
                      <div>28</div>
                      <div>29</div>
                      <div>30</div>
                      <div>31</div>
                      <div className="text-gray-300">1</div>
                    </div>
                  </motion.div>

                  {/* Upcoming Bookings */}
                  <motion.div
                    variants={itemVariants}
                    {...interactiveSpring}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <h3 className="font-extrabold text-gray-800 mb-5">
                      Upcoming Bookings
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          time: "10:00 AM",
                          title: "Meeting Room A",
                          desc: "Team Meeting",
                        },
                        {
                          time: "02:00 PM",
                          title: "Projector PR-12",
                          desc: "Client Presentation",
                        },
                      ].map((booking, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ x: 6 }}
                          className={`flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors ${i === 0 ? "border-b border-gray-50" : ""}`}
                        >
                          <div className="bg-purple-50 p-2 rounded-lg text-center min-w-[60px]">
                            <p className="text-xs text-purple-600 font-bold">
                              24 May
                            </p>
                            <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                              {booking.time}
                            </p>
                          </div>
                          <div className="flex-1 ml-4">
                            <p className="text-sm font-bold text-gray-800">
                              {booking.title}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              {booking.desc}
                            </p>
                          </div>
                          <span className="bg-green-100 text-green-700 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">
                            Upcoming
                          </span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-5">
                      <a
                        href="#"
                        className="text-xs text-purple-600 font-bold hover:text-purple-800 transition-colors"
                      >
                        View all bookings &rarr;
                      </a>
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Maintenance Requests */}
                  <motion.div
                    variants={itemVariants}
                    {...interactiveSpring}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <h3 className="font-extrabold text-gray-800 mb-5">
                      Maintenance Requests
                    </h3>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 cursor-pointer"
                    >
                      <div className="p-2.5 bg-red-100 text-red-500 rounded-xl">
                        <AlertCircle size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">
                          Laptop overheating issue
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          Req: 20 May 2024
                        </p>
                      </div>
                      <span className="bg-orange-100 text-orange-600 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">
                        Pending
                      </span>
                    </motion.div>
                    <div className="mt-5">
                      <a
                        href="#"
                        className="text-xs text-purple-600 font-bold hover:text-purple-800 transition-colors"
                      >
                        View all requests &rarr;
                      </a>
                    </div>
                  </motion.div>

                  {/* Quick Actions */}
                  <motion.div
                    variants={itemVariants}
                    {...interactiveSpring}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <h3 className="font-extrabold text-gray-800 mb-5">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          icon: CalendarDays,
                          color: "text-blue-600",
                          bg: "bg-blue-50",
                          label: "Book Resource",
                        },
                        {
                          icon: Wrench,
                          color: "text-green-600",
                          bg: "bg-green-50",
                          label: "Maintenance",
                        },
                        {
                          icon: CornerDownLeft,
                          color: "text-purple-600",
                          bg: "bg-purple-50",
                          label: "Req Return",
                        },
                        {
                          icon: ArrowRightLeft,
                          color: "text-orange-600",
                          bg: "bg-orange-50",
                          label: "Req Transfer",
                        },
                      ].map((action, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{
                            scale: 1.05,
                            y: -2,
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          }}
                          whileTap={{ scale: 0.95, y: 0 }}
                          className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 transition-colors text-left bg-white hover:border-transparent"
                        >
                          <div className={`p-1.5 rounded-lg ${action.bg}`}>
                            <action.icon size={16} className={action.color} />
                          </div>
                          <span className="text-xs font-bold text-gray-700">
                            {action.label}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* My Assets */}
                <motion.div
                  variants={itemVariants}
                  {...interactiveSpring}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-extrabold text-gray-800">My Assets</h3>
                    <a
                      href="#"
                      className="text-xs text-purple-600 font-bold hover:text-purple-800 transition-colors"
                    >
                      View all
                    </a>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        icon: Laptop,
                        title: "Laptop AF-1012",
                        sub: "Dell Latitude 5420",
                        extra: "Due: 25 May",
                      },
                      {
                        icon: CreditCard,
                        title: "ID Card IC-2045",
                        sub: "Employee ID Card",
                        extra: "...",
                      },
                      {
                        icon: Mouse,
                        title: "Mouse MS-09",
                        sub: "Dell Wireless Mouse",
                        extra: "...",
                      },
                    ].map((asset, i) => (
                      <motion.div
                        key={i}
                        whileHover={{
                          scale: 1.02,
                          x: 4,
                          backgroundColor: "#f8fafc",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 p-3.5 border border-gray-100 rounded-xl transition-all cursor-pointer"
                      >
                        <div className="p-2.5 bg-gray-50 text-gray-600 rounded-xl border border-gray-100">
                          <asset.icon size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800">
                            {asset.title}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">
                            {asset.sub}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          {asset.extra === "..." ? (
                            <button className="text-gray-400 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
                              ...
                            </button>
                          ) : (
                            <p className="bg-gray-100 px-2.5 py-1.5 rounded-lg text-gray-600 font-bold text-[10px] uppercase tracking-wide">
                              {asset.extra}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Notifications */}
                <motion.div
                  variants={itemVariants}
                  {...interactiveSpring}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <h3 className="font-extrabold text-gray-800 mb-5">
                    Recent Notifications
                  </h3>
                  <div className="space-y-5">
                    {[
                      {
                        text: "Your booking for Meeting Room A is confirmed",
                        time: "10 mins ago",
                      },
                      {
                        text: "Maintenance request is under review",
                        time: "1 hour ago",
                      },
                      {
                        text: "Please return Laptop AF-1012 by 25 May",
                        time: "2 hours ago",
                      },
                    ].map((note, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ x: 6 }}
                        className="flex items-start gap-4 cursor-pointer group"
                      >
                        <div className="mt-0.5 p-1.5 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                          <Clock size={14} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 font-semibold group-hover:text-purple-600 transition-colors leading-tight">
                            {note.text}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 font-medium">
                            {note.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-50">
                    <a
                      href="#"
                      className="text-xs text-purple-600 font-bold hover:text-purple-800 transition-colors"
                    >
                      View all notifications &rarr;
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
