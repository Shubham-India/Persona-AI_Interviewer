import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema({

    userId: {
         type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },

    interviewPatternId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "InterviewPattern", 
        required: true 
    },

    conversation: [
        {
            qNo: { type: Number, required: true },
            question: { type: String },
            answer: { type: String },
            timestamp: { type: Date, default: Date.now },
        }
    ],

    feedbackperquestion: [
        {
            questionId: Number,
            status: String,
            whatWrong: String,
            improvementTip: String,
        }
    ],
    feedBack: {
        perfect_areas: [String], 
        improvements: [String],
    },
    topic: { type: String },
    difficultyLevel: { type: String },
    score: { type: Number },
    correctness: { type: String }, 
    accuracy: { type: String },
    structure: { type: String },
    confidence: { type: String },
    status: { type: String, enum: ["active", "ended"], default: "active" },
}, { timestamps: true });

export const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);