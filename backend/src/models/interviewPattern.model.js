import mongoose from "mongoose";

const interviewPatternSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        
        required: true
    },



    difficultyLevel: {
        type: String,
        
        required: true
    },

    voice: {
       
        type : String,
        required: true
    },

    totalQuestions: {
        type: Number,
        
        required: true
    },

    resumeFileURL: {
        type: String,
        default: "" 
    },
    resumeText: {
        type: String,
        default: "" 
    }
}, { timestamps: true });

export const InterviewPattern = mongoose.model("InterviewPattern", interviewPatternSchema);
