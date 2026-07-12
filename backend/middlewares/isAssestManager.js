import User from "../models/userModel.js";

const isAssetManager = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User profile not found.",
      });
    }

    if (user.role !== "ASSET_MANAGER") {
      return res.status(403).json({
        message: "Access Denied. Asset Manager permission required.",
      });
    }

    next();
  } catch (error) {
    console.error("ASSET MANAGER VERIFICATION ERROR:", error.message);

    return res.status(500).json({
      message: "Server error during role verification.",
    });
  }
};

export default isAssetManager;
