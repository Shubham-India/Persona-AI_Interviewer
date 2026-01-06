// controllers/userAnswer.controller.js
import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";

import { InterviewSession } from "../models/interview_session.model.js";
export const saveUserAnswer = asyncHandler(async (req, res, next) => {
    const { answer } = req.body;
    const userId = req.user._id;
    const { interviewId, questionId } = req.params;


    console.log("--- DEBUG START ---");
    console.log("UserID from Token:", userId);
    console.log("InterviewID from URL:", interviewId);
    console.log("Question No (Converted):", Number(questionId));
    console.log("Answer Text:", answer);

    if (!questionId || !interviewId) {
        throw new apiError(400, "InterviewId and QuestionId are required");
    }

    const updateUserAnswer = await InterviewSession.findOneAndUpdate(
        { 
            interviewPatternId: interviewId, 
            userId: userId,
            "conversation.qNo": Number(questionId) 
        },
        {
            $set: { 
                "conversation.$.answer": answer 
            }
        },
        { new: true, runValidators: true }
    );

    if (!updateUserAnswer) {
        console.error("--- UPDATE FAILED: Document not found with these filters ---");

        return res.status(404).json({
            success: false,
            message: "Interview session or Question number not found in DB"
        });
    }

    console.log("--- UPDATE SUCCESS: Database Updated ---");

    return res.status(200).json(
        new apiResponse(200, updateUserAnswer, "Answer saved successfully")
    );
});