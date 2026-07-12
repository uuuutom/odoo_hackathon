import express from "express";

import isAuth from "../middlewares/isAuth.js";
import isAssetManager from "../middlewares/isAssetManager.js";

import { getAssetDashboard } from "../controllers/assetManagerDashController.js";

const router = express.Router();

router.get(
  "/assets-manager-dash",
  isAuth,
  //  isAssetManager,
  getAssetDashboard,
);

export default router;
