import User from "../models/userModel.js";

const isDepartmentHead = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User profile not found.",
      });
    }

    if (user.role !== "DEPARTMENT_HEAD") {
      return res.status(403).json({
        message: "Access Denied. Department Head permission required.",
      });
    }

    next();
  } catch (error) {
    console.error("DEPARTMENT HEAD VERIFICATION ERROR:", error.message);

    return res.status(500).json({
      message: "Server error during role verification.",
    });
  }
};

export default isDepartmentHead;
