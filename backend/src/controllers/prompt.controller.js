import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

import { InterviewPattern } from "../models/interviewPattern.model.js";

import { generateAI } from "../services/gemini.services.js"; // Aapka service import
import { InterviewSession } from "../models/interview_session.model.js";


export const startInterview = asyncHandler(async (req, res) => {

    const userId = req.user?._id
    
    if (!userId) throw new apiError(401, "User not authenticated");

    const interviewPatternId = req.params?.id
   
   


    const documentArray = await InterviewPattern.findOne({ 
        userId: userId, 
        _id: interviewPatternId 
    }).select('difficultyLevel resumeText totalQuestions');
    
    if (!documentArray) {
        throw new apiError(404, "Interview Pattern/Resume not found. Please upload first.");
    }



    const finalDifficulty = documentArray.difficultyLevel || "Intermediate";
    const resumeText = documentArray.resumeText || "Create Some Interview general Question common to all Computer Science and Software Development Roles ";
    const totalQuestions = documentArray.totalQuestions || 5;
    
    if (!finalDifficulty) throw new apiError(400, "Difficulty level is required");
    if (!resumeText) throw new apiError(400, "Resume text is missing");
    

    const systemPrompt = `
    You are an Expert Interviewer AI for a system called Persona.
    Rules:
    - Use ONLY the candidate's resume + difficulty level.
    - No hallucination.
    - Difficulty: ${finalDifficulty}.
    - Return RAW JSON format ONLY.
    `;
    
    const userPrompt = `
    Resume: "${resumeText}"
    
    
    Task: Generate ${totalQuestions} interview questions and assign suitable topics name
    
    Output JSON Format:
    { "topic",
        "questions": [
            {"questionText": "Question string", "difficulty": "Intermediate", "topic": "topic"}
        ]
    }
    `;
    
    const finalPrompt = systemPrompt + "\n\n" + userPrompt;

    

    try {
        console.log("🤖 Gemini ko request bhej raha hu...");
        console.log(interviewPatternId)
        
        const rawResponse = await generateAI(finalPrompt); 

        console.log("✅ Gemini se response mil gaya:", rawResponse.stringfy);

        
        const topic = rawResponse.topic || "General Topics";
        const generatedQuestionsData = rawResponse.questions
        .map((item , index)=>{
            return {
                qNo: index + 1,
                question: item.questionText,
                answer: "",
                difficulty: item.difficulty || "Intermediate",
                topic: item.topic || "",
                
            }
        })
      
        
        const interview_session = await InterviewSession.create({
            topic: `Interview on ${topic || "General Topics"}`,
            conversation: generatedQuestionsData,
            userId: userId,
            interviewPatternId: interviewPatternId,
            difficultyLevel: finalDifficulty,




        });
       
        
        return res.status(201).json(
            new apiResponse(201, {
                 rawResponse, // Frontend ko JSON bhejo
                
            }, "Interview Started & Questions Generated")
        );
    } catch (error) {
        if (!isAborted) {
            res.status(500).json({ error: "Internal Server Error" });
        }
        console.error("AI Generation Error:", error);
        throw new apiError(500, "Failed to generate questions from AI");
    }
    
    
   
  


});




