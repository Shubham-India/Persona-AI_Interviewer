import express from "express";
import { saveUserAnswer } from "../controllers/useranswer.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/saveUserAnswer/:interviewId/:questionId", verifyJWT , asyncHandler(saveUserAnswer));

export default router;