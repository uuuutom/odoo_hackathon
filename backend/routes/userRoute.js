import express from "express";
import { getCurrentUser, getAllUsers } from "../controllers/userController.js";

import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// Current Logged In User
router.get("/current-user", isAuth, getCurrentUser);

// All Users (Admin Only)
router.get("/all-users", isAuth, isAdmin, getAllUsers);

export default router;
