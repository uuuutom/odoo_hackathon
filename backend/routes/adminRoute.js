import express from "express";
import { getDashboardAnalytics } from "../controllers/adminController.js";
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/admin-dash", isAuth, isAdmin, getDashboardAnalytics);

export default router;
