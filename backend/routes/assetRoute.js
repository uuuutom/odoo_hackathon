import express from "express";

import {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} from "../controllers/assetController.js";

import isAuth from "../middlewares/isAuth.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Asset Routes
|--------------------------------------------------------------------------
*/

// Get all assets
router.get("/", isAuth, getAllAssets);

// Get single asset
router.get("/:id", isAuth, getAssetById);

// Create asset
router.post(
  "/",
  //isAuth,
  // authorize("Admin", "Asset Manager"),
  createAsset,
);

// Update asset
router.put("/:id", isAuth, authorize("Admin", "Asset Manager"), updateAsset);

// Delete asset
router.delete("/:id", isAuth, authorize("Admin"), deleteAsset);

export default router;
