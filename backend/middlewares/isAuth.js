// import jwt from "jsonwebtoken";

// const isAuth = (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     // console.log("TOKEN RECEIVED:", token);

//     if (!token) {
//       return res.status(401).json({ message: "No token found" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // console.log("DECODED TOKEN:", decoded);

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log("AUTH ERROR:", error.message);

//     return res.status(401).json({
//       message: "Token invalid or expired",
//     });
//   }
// };

// export default isAuth;

import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Change this path/name if your model filename is different

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "No token found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    return res.status(401).json({
      message: "Token invalid or expired",
    });
  }
};

export default isAuth;
