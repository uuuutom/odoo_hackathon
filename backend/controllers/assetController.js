import Asset from "../models/assetModel.js";
import { updateAssetSchema } from "../validation/assetValidation.js";

/**
 * @desc    Create Asset
 * @route   POST /api/assets
 * @access  Asset Manager/Admin
 */

import { generateAssetId } from "../utils/generateAssetId.js";
import { createAssetSchema } from "../validation/assetValidation.js";

export const createAsset = async (req, res) => {
  try {
    const { error } = createAssetSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const exists = await Asset.findOne({
      serialNumber: req.body.serialNumber,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Serial number already exists.",
      });
    }

    const assetId = await generateAssetId(Asset);

    const asset = await Asset.create({
      ...req.body,
      assetId,
    });

    res.status(201).json({
      success: true,
      message: "Asset created successfully.",
      data: asset,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * @desc    Get All Assets
 * @route   GET /api/assets
 * @access  Private
 */

export const getAllAssets = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      department,
      page = 1,
      limit = 10,
      sort = "newest",
    } = req.query;

    let query = {};

    // Search
    if (search) {
      query.$or = [
        { assetName: { $regex: search, $options: "i" } },
        { assetId: { $regex: search, $options: "i" } },
        { serialNumber: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (department) query.department = department;

    // Sorting
    let sortOption = {};

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "name":
        sortOption = { assetName: 1 };
        break;

      case "price":
        sortOption = { purchasePrice: -1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const totalAssets = await Asset.countDocuments(query);

    const assets = await Asset.find(query)
      .populate("assignedTo", "name email")
      .populate("department", "name")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      currentPage: Number(page),
      totalPages: Math.ceil(totalAssets / limit),
      totalAssets,
      count: assets.length,
      data: assets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get Single Asset
 * @route   GET /api/assets/:id
 * @access  Private
 */
export const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("department", "name");

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update Asset
 * @route   PUT /api/assets/:id
 * @access  Asset Manager/Admin
 */
export const updateAsset = async (req, res) => {
  try {
    const { error } = updateAssetSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Asset updated successfully.",
      data: asset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Delete Asset
 * @route   DELETE /api/assets/:id
 * @access  Admin
 */
export const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found.",
      });
    }

    await asset.deleteOne();

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
