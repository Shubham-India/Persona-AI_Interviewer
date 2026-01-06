import { generateAI } from "../services/gemini.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { InterviewSession } from "../models/interview_session.model.js";


export const buildEvaluationPrompt = (qaPairs) => {
    const conversationContext = qaPairs.map((item, index) => {
        const qText = item.question ? item.question : "Question not found";
        const aText = item.answer;
        return `
        [INTERACTION : ${index + 1}]
        Question: "${qText}"
        User Answer: "${aText}"
        --------------------------------`;
    }).join("\n");

    return `
    --- ROLE ---
    You are an AI Interview Coach and Analytics Engine.
    
    --- DATA TO ANALYZE ---
    ${conversationContext}
    
    --- TASK ---
    Compare the User's Answer against the Question for every interaction.
    Output ONLY a valid JSON object.
    
    --- REQUIRED OUTPUT FORMAT (JSON ONLY) ---
    {
      "overallMetrics": {
        "score": 0 to 10 only,
        "correctness": "High/Medium/Low",
        "structure": "",
        
        ,
        "AI Insight" : "",
        "accuracy": "High/Medium/Low",
        "clarity": "High/Medium/Low",
        "confidence": "High/Medium/Low"
        },
      "feedbackLists": {
        "perfectAreas": ["Point 1", "Point 2"],
        "areasToImprove": ["Point 1", "Point 2"]
        },
        "questionWiseAnalysis": [
          { "questionId": 1, "status": "Correct/Incorrect","whatWrong": "Explanation", "improvementTip": "Tip" }
          ]
    }`;
  };
  

  


export const generateReport = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { interviewId } = req.params;

    const session = await InterviewSession.findOne({ 
        userId, 
        interviewPatternId: interviewId 
    }).select("conversation");

    if (!session || session.conversation.length === 0) {
        throw new apiError(404, "No conversation found to evaluate.");
    }

    const prompt = buildEvaluationPrompt(session.conversation);

    try {
        const aiData = await generateAI(prompt);
        
   
        

        const updatedSession = await InterviewSession.findOneAndUpdate(
            { userId, interviewPatternId: interviewId },
            {
                $set: {
                    "feedBack.perfect_areas": aiData.feedbackLists.perfectAreas || [],
                    "feedBack.improvements": aiData.feedbackLists.areasToImprove || [],
                    score: aiData.overallMetrics.score,
                    correctness: aiData.overallMetrics.correctness,
                    accuracy: aiData.overallMetrics.accuracy,
                    confidence: aiData.overallMetrics.confidence,
                    structure: aiData.overallMetrics.structure,
                    feedbackperquestion: aiData.questionWiseAnalysis // Array matching
                },
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json(
            new apiResponse(200, updatedSession, "Report Generated Successfully")
        );

    } catch (error) {
        console.error("❌ Generation Error:", error);
        if (error instanceof SyntaxError) {
            throw new apiError(500, "AI output format was invalid. Try again.");
        }
        throw new apiError(500, error.message || "Internal Server Error");
    }
});











// import { InterviewPattern } from "../models/interviewPattern.model";
// import asyncHandler from "../middlewares/asyncHandler.js";
// import ApiError from "../utils/apiError.js";
// import Question from "../models/question.model.js";
// import { generateAI } from "../services/gemini.services.js";
// import { Report } from "../models/report.model.js";


// const qaPairs = await UserAnswer.find({ 
//     user: userId, 
//     interviewPattern: interviewPatternId 
// })
// .populate("question", "questionText")  // Question Model se sirf 'questionText' laayega
// .select("answerText question");





// export default buildEvaluationPrompt = (qaPairs) => {
//     // qaPairs is an array from DB: [{ question: "...", answer: "..." }, ...]

//     // 1. Format the Conversation for the AI
//     const conversationContext = qaPairs.map((item, index) => {
//       const qText = item.question ? item.question.questionText : "Question not found";
//     const aText = item.answerText;
//         return `
//         [INTERACTION ${index + 1}]
//         Question: "${qText}"
//         User Answer: "${aText}"
//         --------------------------------
//         `;
//     }).join("\n");

//     // 2. The "Sandwich" Prompt with Strict JSON Output
//     const finalPrompt = `
//     --- ROLE ---
//     You are an AI Interview Coach and Analytics Engine.
    
//     --- DATA TO ANALYZE ---
//     ${conversationContext}
    
//     --- TASK ---
//     Compare the User's Answer against the Question for every interaction.
//     Aggregate the performance into a FINAL EVALUATION REPORT.
    
//     --- METRICS DEFINITION ---
//     1. Score: Integer (0-10).
//     2. Correctness: Factual accuracy of the answer.
//     3. Structure: usage of STAR method or logical flow.
//     4. Communication: Grammar and vocabulary quality.
//     5. Pace: Conciseness (is it too short or rambling?).
//     6. Accuracy: Relevancy to the specific question asked.
//     7. Clarity: How easy it is to understand.
//     8. Confidence: Assertiveness of language (lack of filler words like 'um', 'maybe').
    
//     --- REQUIRED OUTPUT FORMAT (JSON ONLY) ---
//     Do not write any introduction or conclusion. Output ONLY a valid JSON object:
    
//     {
//       "overallMetrics": {
//         "score": 0,
//         "correctness": "High/Medium/Low",
//         "structure": "High/Medium/Low",
//         "communication": "High/Medium/Low",
//         "pace": "Fast/Good/Slow",
//         "accuracy": "High/Medium/Low",
//         "clarity": "High/Medium/Low",
//         "confidence": "High/Medium/Low"
//       },
//       "feedbackLists": {
//         "perfectAreas": ["Point 1", "Point 2"],
//         "areasToImprove": ["Point 1", "Point 2"]
//       },
//       "questionWiseAnalysis": [
//         {
//           "questionId": 1,
//           "status": "Correct/Incorrect",
//           "improvementTip": "Short specific tip"
//         }
//       ]
//     }
//     `;

//     return finalPrompt;
// };
// const prompt = buildEvaluationPrompt(qaPairs)
// const evaluationResults = await generateAI(prompt)
// const aiRawText = JSON.parse(evaluationResults)
// export const report = aiRawText;


// export const generateReport = asyncHandler(async (req, res) => {
//   Report.create{
//     userId: req.user._id,
//     interviewPatternId: req.body.interviewPatternId,
//     topic: req.body.topic,
//     score: report.overallMetrics.score,
//     difficultyLevel: req.body.difficultyLevel,
//     score :aiRawText.overallMetrics.score
//     correctedness :aiRawText.overallMetrics.correctedness
//     accuracy :aiRawText.overallMetrics.accuracy
//     score :aiRawText.overallMetrics.score
//     Improvemetns :aiRawText.feedbackLists.areastoImprove
//     perfectareas :aiRawText.feedbackLists.perfectareas
//     confidence : aiRawText.overallMetrics.confidence
//   }
// })

// export const generateReport = asyncHandler(async (req, res) => {
//     const userId = req.user._id;
//     const { interviewId } = req.params;

//     // 1. Pehle check karein ki session exists karta hai ya nahi
//     const session = await InterviewSession.findOne({ 
//         userId: userId, 
//         interviewPatternId: interviewId
//     }).select("conversation");

//     if (!session || !session.conversation || session.conversation.length === 0) {
//         throw new apiError(404, "No conversation found to evaluate.");
//     }

//     const prompt = buildEvaluationPrompt(session.conversation);

//     try {
//         const aiData = await generateAI(prompt);
        
//         console.log("✅ Parsed AI Data:", aiData);
//         // 2. IMPORTANT: String ko JSON Object mein convert karein
//         // Kabhi kabhi AI ```json ... ``` ke saath response deta hai, usse clean karna zaroori hai
//         // const cleanJsonString = rawResponse.replace(/```json|```/g, "").trim();
//         // const aiData = JSON.parse(rawResponse);


//         // 3. Database Update
//         const updatedSession = await InterviewSession.findOneAndUpdate(
//             {
//                 userId: userId,
//                 interviewPatternId: interviewId,
//             },
//             {
//                 $set: {
//                     "feedBack.perfect_areas": aiData.feedbackLists.perfectAreas,
//                     "feedBack.improvements": aiData.feedbackLists.areasToImprove,
//                     score: aiData.overallMetrics.score,
//                     correctness: aiData.overallMetrics.correctness,
//                     accuracy: aiData.overallMetrics.accuracy,
//                     confidence: aiData.overallMetrics.confidence,
//                     structure: aiData.overallMetrics.structure,
//                     feedbackperquestion: aiData.questionWiseAnalysis
//                 },
//             },
//             { new: true, runValidators: true }
//         );

//         if (!updatedSession) {
//             throw new apiError(404, "Failed to update report. Session not found.");
//         }

//         return res.status(200).json(
//             new apiResponse(200, updatedSession, "Interview Report Generated Successfully")
//         );

//     } catch (error) {
      
//       if (error instanceof SyntaxError) {
//         throw new apiError(500, "AI returned invalid JSON format.");
//       }
      
//       if (error.status === 429 || error.message.includes("429")) {
//         return res.status(429).json({
//           success: false,
//           message: "AI is a bit busy right now. Please wait about 1 minute before generating the report again."
//         });
//       }
//       console.error("❌ Error in generateReport:", error);

//         throw new apiError(500, error?.message || "Internal Server Error during report generation");
//     }
// });