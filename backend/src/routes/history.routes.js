import express from "express";
import { reportsHistory } from "../controllers/history.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/history", verifyJWT, asyncHandler(reportsHistory));

export default router;