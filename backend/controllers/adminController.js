export const getDashboardAnalytics = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Admin dashboard working",
      user: req.userId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
