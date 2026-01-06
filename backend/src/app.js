import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";

// import routes
import healthcheckRouter from './routes/healthcheck.routes.js';
import userRouter from './routes/user.routes.js';

import questionRouter from './routes/question.routes.js';
import historyRouter from './routes/history.routes.js';
import reportRouter from './routes/report.routes.js';
import resumeRouter from './routes/resume.routes.js';
import userAnswer from './routes/useranswer.routes.js';


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser());



// routes
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter);

app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/reports", historyRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/resume", resumeRouter);
app.use("/api/v1/useranswers", userAnswer);






export {app}