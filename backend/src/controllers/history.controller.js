import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { InterviewSession } from "../models/interview_session.model.js";

// export const dashBoardHistory = asyncHandler(async (req, res) => {
  
//     const userId = req.user?._id 
    
//     if (!userId) {
//         throw new apiError(401, "User not authenticated");
//     }
 
//     const reports = await InterviewSession.find({ userId: userId }).sort({ createdAt: -1 });
    
//     if (!reports || reports.length === 0) {
//         return res.status(200).json(
//             new apiResponse(200, [], "No interview history found")
//         );
//     }
    
    

// });


export const reportsHistory = asyncHandler(async(req , res)=>{
    const userId = req.user?._id

    if (!userId) throw new apiError(401, "User not authenticated");

    try {
      const reports = await InterviewSession.find({userId : userId}).sort({ createdAt: -1});
            if (!reports || reports.length === 0) {
                return res.status(200).json(
                new apiResponse(200, [], "No interview history found")
                );
            }
        res.status(200).json(
            new apiResponse(200, reports, "User report history fetched successfully")
        );
    } catch (error) {
        throw new apiError(500, "Interview_Session Not created " + error.message);
    }
})