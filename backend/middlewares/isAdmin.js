import User from "../models/userModel.js";

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User profile not found.",
      });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Admin access required.",
      });
    }

    next();
  } catch (error) {
    console.error("ADMIN VERIFICATION ERROR:", error.message);

    return res.status(500).json({
      message: "Server error during role verification.",
    });
  }
};

export default isAdmin;
