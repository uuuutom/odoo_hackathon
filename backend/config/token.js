import jwt from "jsonwebtoken";

export const genToken = (userId) => {
  try {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.log("token gen err:", error);
    throw error;
  }
};
