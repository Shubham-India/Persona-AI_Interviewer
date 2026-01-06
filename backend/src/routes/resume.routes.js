import express from "express";
import { createInterviewPattern } from "../controllers/resume.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = express.Router();

console.log("Interview Pattern route loaded");


router.post("/createInterviewPattern", verifyJWT, asyncHandler(createInterviewPattern));

export default router;