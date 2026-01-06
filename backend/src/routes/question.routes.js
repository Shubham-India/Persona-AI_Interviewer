import express from "express";
// import { createGeneratedQuestion } from "../controllers/question.controller.js";
import { startInterview } from "../controllers/prompt.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/startInterview/:id", verifyJWT , asyncHandler(startInterview));

export default router;