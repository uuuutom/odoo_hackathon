import Asset from "../models/assetModel.js";

export const getAssetDashboard = async (req, res) => {
  try {
    console.log(req.user);

    const totalAssets = await Asset.countDocuments();

    const statusData = await Asset.aggregate([
      {
        $group: {
          _id: "$status",
          value: {
            $sum: 1,
          },
        },
      },
    ]);

    const categoryData = await Asset.aggregate([
      {
        $group: {
          _id: "$category",
          value: {
            $sum: 1,
          },
        },
      },
    ]);

    const maintenanceData = await Asset.aggregate([
      {
        $match: {
          status: "Maintenance",
        },
      },
      {
        $group: {
          _id: "$maintenanceStatus",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    console.log("TOTAL ASSETS:", totalAssets);

    res.status(200).json({
      success: true,

      data: {
        totalAssets,
        statusData,
        categoryData,
        maintenanceData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
