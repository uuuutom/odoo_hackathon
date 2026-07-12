import express from "express";
import isAuth from "../middlewares/isAuth.js";
import isDepartmentHead from "../middlewares/isDepartmentHead.js";

const router = express.Router();

router.get(
  "/department-head-dash",
  isAuth,
  isDepartmentHead,
  getDepartmentAssets,
);

export default router;
