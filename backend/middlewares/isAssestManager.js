import User from "../models/userModel.js";

const isAssetManager = async (req, res, next) => {
  try {
    console.log("USER ID FROM TOKEN:", req.userId);

    const user = await User.findById(req.userId);

    console.log("USER DATA:", user);

    if (!user) {
      return res.status(404).json({
        message: "User profile not found.",
      });
    }

    if (user.role !== "Asset Manager") {
      return res.status(403).json({
        message: "Access Denied. Asset Manager permission required.",
        yourRole: user.role,
      });
    }

    next();
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export default isAssetManager;
