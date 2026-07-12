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
} from "lucide-react";

export const sidebarMenu = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    permission: "DASHBOARD_VIEW",
  },

  {
    label: "Departments",
    path: "/departments",
    icon: Users,
    permission: "DEPARTMENT_VIEW",
  },

  {
    label: "Employees",
    path: "/employees",
    icon: Users,
    permission: "EMPLOYEE_VIEW",
  },

  {
    label: "Asset Categories",
    path: "/categories",
    icon: Grid,
    permission: "CATEGORY_VIEW",
  },

  {
    label: "Assets",
    path: "/assets",
    icon: Box,
    permission: "ASSET_VIEW",
  },

  {
    label: "Allocation",
    path: "/allocation",
    icon: Map,
    permission: "ALLOCATION_VIEW",
  },

  {
    label: "Bookings",
    path: "/bookings",
    icon: Calendar,
    permission: "BOOKING_VIEW",
  },

  {
    label: "Maintenance",
    path: "/maintenance",
    icon: Wrench,
    permission: "MAINTENANCE_VIEW",
  },

  {
    label: "Audit",
    path: "/audit",
    icon: Shield,
    permission: "AUDIT_VIEW",
  },

  {
    label: "Reports",
    path: "/reports",
    icon: FileText,
    permission: "REPORT_VIEW",
  },

  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
    badge: true,
    permission: "NOTIFICATION_VIEW",
  },

  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
    permission: "SETTING_VIEW",
  },

  {
    label: "Activity Logs",
    path: "/activity",
    icon: Activity,
    permission: "ACTIVITY_VIEW",
  },
];
