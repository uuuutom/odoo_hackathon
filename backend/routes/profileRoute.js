import express from "express";
import { getMyProfile } from "../controllers/profileController.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/profile", isAuth, getMyProfile);

export default router;
