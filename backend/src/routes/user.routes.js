import express from "express";
import { loginUser , logoutUser, registerUser, refreshAccessToken , getCurrentUser } from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateAuthRequest } from "../middlewares/validateuser.middleware.js";
import {  verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// -----------------------------
// POST /api/user/auth
// Signup / Login combined
// -----------------------------
router.post("/login", validateAuthRequest, asyncHandler(loginUser));
router.post("/register", validateAuthRequest, asyncHandler(registerUser));
router.post("/logout",verifyJWT, asyncHandler(logoutUser));
router.post("/refresh-token", asyncHandler(refreshAccessToken));
router.get("/me", verifyJWT, asyncHandler(getCurrentUser));

export default router;
