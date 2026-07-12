import User from "../models/userModel.js";
import redisClient from "../config/redis.js";

export const getCurrentUser = async (req, res) => {
  try {
    const cachedUser = await redisClient.get(`user:${req.userId}`);

    if (cachedUser) {
      return res.status(200).json({
        success: true,
        user: JSON.parse(cachedUser),
      });
    }

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await redisClient.setex(`user:${req.userId}`, 3600, JSON.stringify(user));

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({
      createdAt: -1,
    });
    // FIX: Check the length of the array, not just if it exists
    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found in the database" });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to get all users: ${error.message}` });
  }
};
