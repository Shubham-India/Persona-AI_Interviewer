import express from "express";
import { generateReport } from "../controllers/answerevaluation.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/generateReport/:interviewId", verifyJWT , asyncHandler(generateReport));

export default router;