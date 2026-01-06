
import { InterviewPattern } from "../models/interviewPattern.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";


export const createInterviewPattern = asyncHandler(async (req, res, next) => {
    const { difficultyLevel, voice, totalQuestions, resumeFileURL, resumeText } = req.body;
    const userId = req.user._id; 

   
    if (!difficultyLevel || !voice  || !resumeText) {
        return next(new apiError(400, "difficultyLevel, voice, durationMinutes, and resumeText are required"));
    }

    const newPattern = await InterviewPattern.create({
         userId: userId,
        difficultyLevel : difficultyLevel,
        voice : voice,
        totalQuestions : totalQuestions,
        resumeFileURL: resumeFileURL || "",
        resumeText: resumeText || "",
    });

    res.status(201).json(new apiResponse(201, 
        {interviewId :newPattern._id, userId :newPattern.userId}
    , "Interview Pattern created successfully", newPattern));
});


