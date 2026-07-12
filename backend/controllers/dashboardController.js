import Asset from "../models/assetModel.js";
import User from "../models/userModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Asset counts
    const totalAssets = await Asset.countDocuments();

    const availableAssets = await Asset.countDocuments({
      status: "Available",
    });

    const allocatedAssets = await Asset.countDocuments({
      status: "Allocated",
    });

    const maintenanceAssets = await Asset.countDocuments({
      status: "Maintenance",
    });

    const lostAssets = await Asset.countDocuments({
      status: "Lost",
    });

    // Notifications
    const notifications = [];

    if (maintenanceAssets > 0) {
      notifications.push({
        msg: `${maintenanceAssets} assets require maintenance`,
        time: "Recently",
        type: "danger",
      });
    }

    if (lostAssets > 0) {
      notifications.push({
        msg: `${lostAssets} assets are lost`,
        time: "Recently",
        type: "danger",
      });
    }

    if (allocatedAssets > 0) {
      notifications.push({
        msg: `${allocatedAssets} assets are currently allocated`,
        time: "Recently",
        type: "info",
      });
    }

    // Employee count
    const totalEmployees = await User.countDocuments({
      role: "Employee",
    });

    // Category graph
    const categoryGraph = await Asset.aggregate([
      {
        $group: {
          _id: "$category",
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1,
        },
      },
    ]);

    // Status graph
    const statusGraph = await Asset.aggregate([
      {
        $group: {
          _id: "$status",
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1,
        },
      },
    ]);

    // Recent Activities
    const recentActivities = await Asset.find()
      .sort({ createdAt: -1 }) // latest assets first
      .limit(5)
      .select("assetName assetId status createdAt");

    res.status(200).json({
      success: true,
      data: {
        totalAssets,
        notifications,
        availableAssets,
        allocatedAssets,
        maintenanceAssets,
        lostAssets,
        totalEmployees,
        categoryGraph,
        statusGraph,
        recentActivities,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
