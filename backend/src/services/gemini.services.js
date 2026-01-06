// for gemini 2.5




import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
// import { createInterviewPrompt } from "../controllers/prompt.controller.js";
import { apiError } from "../utils/apiError.js";
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
export async function generateAI(finalprompt) {
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalprompt,
    });
    const generatedText = response.text;
   
        const cleanedText = generatedText.replace(/```json/g, "").replace(/```/g, "").trim();
        
   
        return JSON.parse(cleanedText);
   
  } catch (error) {
    console.error("Error generating content, API service Error:", error);
    throw new apiError("Content generation failed, API service error", 500);
  }
}



// // gemini 2.0
// import dotenv from "dotenv";
// import { GoogleGenAI } from "@google/genai";
// import { apiError } from "../utils/apiError.js";

// dotenv.config();

// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY
// });

// export async function generateAI(finalprompt) {
//     try {
//         const response = await ai.models.generateContent({
//             model: "gemini-2.0-flash", // 2.0-flash correct hai
//             contents: [
//                 {
//                     role: "user",
//                     parts: [{ text: finalprompt }] 
//                 }
//             ],
//         });

//         // @google/genai SDK mein text yahan hota hai:
//         const generatedText = response.candidates[0].content.parts[0].text;

//         if (!generatedText) {
//             throw new Error("AI returned an empty response.");
//         }

//         // JSON Clean up (AI aksar ```json ... ``` bhejta hai)
//         const cleanedText = generatedText.replace(/```json/g, "").replace(/```/g, "").trim();
        
//         return JSON.parse(cleanedText);

//     } catch (error) {
//         console.error("Detailed API Error:", error);
        
//         // Agar error 500 hai, toh check karein ki API Key valid hai ya nahi
//         throw new apiError(500, `Gemini 2.0 Error: ${error.message}`);
//     }
// }







// // for gemini 1.5
// import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai"; // Stable Library
// import { apiError } from "../utils/apiError.js";

// dotenv.config();

// // Initialize with your API Key
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function generateAI(finalprompt) {
//   try {
//     // Model select karein (Gemini 1.5 Flash)
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // API Call
//     const result = await model.generateContent(finalprompt);
//     const response = await result.response;
//     const generatedText = response.text();

//     if (!generatedText) {
//       throw new Error("AI returned empty response");
//     }

//     // Clean JSON (Agar AI backticks use kare)
//     const cleanedText = generatedText.replace(/```json/g, "").replace(/```/g, "").trim();
    
//     return JSON.parse(cleanedText);

//   } catch (error) {
//     console.error("Gemini API Error:", error);

//     // Specific error handling
//     if (error.message.includes("429")) {
//       throw new apiError(429, "Rate limit exceeded. Try again in a minute.");
//     }
    
//     throw new apiError(500, `AI Service Error: ${error.message}`);
//   }
// }