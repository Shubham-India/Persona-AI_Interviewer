# Persona.ai — AI Interviewer

<div align="center">

# 🎙️ Persona.ai

### AI-Powered Mock Interview Platform

**Practice realistic interviews with questions generated from your resume, answer using your voice, and receive an AI-powered performance analysis.**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/Shubham-India/Persona-AI_Interviewer)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react\&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite\&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/API-Express-000000?logo=express\&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-4285F4?logo=google)](https://ai.google.dev/)

</div>

---

## 📌 Overview

**Persona.ai** is an AI-powered mock interview platform designed to simulate an interactive interview experience rather than a simple question-and-answer chatbot.

The platform allows a candidate to configure an interview, provide professional context through resume text, select a difficulty level and question count, and then enter an interactive interview session.

During the session:

```text
Candidate Profile / Resume Context
              ↓
      Interview Configuration
              ↓
      Gemini AI Question Generation
              ↓
       Interactive Interview
              ↓
   Browser Voice + Speech Input
              ↓
       Answers Stored in DB
              ↓
       Gemini AI Evaluation
              ↓
        Performance Report
              ↓
     Historical Session Tracking
```

The project combines a modern frontend, REST APIs, authentication, persistent storage, browser speech capabilities, and generative AI into one complete interview-practice workflow.

---

# 🎯 Problem Statement

Traditional interview preparation often has two limitations:

1. Candidates practice with static question lists that are not personalized.
2. Candidates rarely receive structured, objective feedback after completing a mock interview.

Persona.ai addresses this by dynamically generating interview questions from the candidate's supplied context and producing a structured AI evaluation after the session.

The goal is not merely to ask questions, but to create a repeatable loop:

> **Prepare → Practice → Evaluate → Improve → Repeat**

---

# ✨ Key Features

## 🧠 Resume-Aware Interview Generation

The interview configuration accepts a candidate's professional context through resume text.

The backend stores the interview configuration and passes the candidate context, selected difficulty, and requested question count into the AI question-generation pipeline.

The AI is instructed to generate questions based on the supplied candidate information and return structured JSON containing questions and topics.

---

## 🎚️ Configurable Interview Sessions

Candidates can configure important session parameters before starting:

| Setting           | Current Capability             |
| ----------------- | ------------------------------ |
| Question Count    | Presets + custom count         |
| Difficulty        | Easy / Intermediate / Advanced |
| Voice             | Browser-based voice selection  |
| Candidate Context | Resume / professional text     |
| Interview Session | Dynamically generated          |

The frontend currently exposes predefined question counts as well as a custom input, along with difficulty selection and voice configuration.

---

## 🎙️ Voice-Enabled Interview Experience

Persona.ai supports a voice-oriented interview experience using browser speech capabilities.

The interview session uses:

* Text-to-Speech for AI questions
* Speech-to-Text for candidate responses
* Microphone start/stop controls
* Automatic transition between AI speech and candidate listening
* Manual controls to restart the microphone
* Skip and save actions

The current implementation uses dedicated frontend hooks for speech-to-text and text-to-speech and coordinates them throughout the interview flow.

---

## 🤖 Gemini-Powered Question Generation

The backend currently integrates Google's Gemini API through the `@google/genai` SDK.

The active model configured in the project is:

**`gemini-2.5-flash`**

The question generation pipeline:

```text
Resume Context
     +
Difficulty Level
     +
Question Count
        ↓
Prompt Construction
        ↓
Gemini 2.5 Flash
        ↓
Structured JSON
        ↓
Interview Session
```

The backend explicitly requests JSON output and then parses the generated response before storing the generated questions in the database.

---

# 🗣️ Interactive Interview Flow

Once an interview begins, the candidate proceeds through the generated questions one at a time.

A typical interaction looks like:

```text
AI asks question
       ↓
Text-to-Speech
       ↓
Candidate listens
       ↓
Microphone starts
       ↓
Candidate speaks
       ↓
Speech-to-Text transcript
       ↓
Candidate reviews response
       ↓
Save & Next / Skip
       ↓
Next question
```

When the final question is completed, the application sends the interview session for AI analysis and redirects the candidate to the report view.

---

# 📊 AI-Powered Interview Evaluation

After the interview, Persona.ai evaluates the collected question-answer pairs.

The evaluation engine compares each user's answer against its corresponding question and generates structured performance data.

The current evaluation model includes:

* Overall score
* Correctness
* Accuracy
* Clarity
* Confidence
* Structure
* Strong areas
* Areas for improvement
* Question-wise analysis

The report-generation prompt explicitly asks the AI to produce overall metrics, strengths, weaknesses, and question-level feedback.

---

# 📈 Performance Report

The results interface presents the interview as a structured performance report.

Current report sections include:

### Overall Performance

Displays the session score and an AI-generated narrative insight.

### Performance Metrics

The interface displays:

* Correctness
* Accuracy
* Confidence
* Difficulty Level

### Strengths

Areas identified by the AI where the candidate performed well.

### Focus Areas

Specific areas that the candidate should improve.

### Question-Wise Breakdown

Detailed analysis associated with individual questions and answers.

The results page is implemented as a dedicated protected route and renders the stored evaluation data from previous sessions.

---

# 🔐 Authentication & Protected Sessions

Persona.ai includes an authentication layer for users.

Current backend authentication functionality includes:

* User registration
* User login
* User logout
* Access-token generation
* Refresh-token flow
* Current-user lookup
* Password hashing with `bcrypt`
* JWT-based authorization
* Protected API routes

The user routes expose authentication endpoints such as:

```text
POST /api/v1/users/login
POST /api/v1/users/register
POST /api/v1/users/logout
POST /api/v1/users/refresh-token
GET  /api/v1/users/me
```

Protected interview and report routes use JWT verification middleware.

---

# 🗄️ Persistent Data Layer

The backend uses **MongoDB** through **Mongoose**.

The application establishes a MongoDB connection at startup before starting the Express server.

The architecture stores information associated with:

* Users
* Interview configurations
* Interview sessions
* Questions
* Candidate answers
* Evaluation results
* Interview history

This allows candidates to return to the dashboard and inspect previous sessions.

---

# 🧩 System Architecture

```text
┌─────────────────────────────────────────────┐
│                 React Frontend              │
│                                             │
│  Login / Register                           │
│  Dashboard                                  │
│  Interview Configuration                    │
│  Voice Interaction                          │
│  Interview Session                          │
│  Results / History                          │
└──────────────────────┬──────────────────────┘
                       │
                       │ REST API
                       ▼
┌─────────────────────────────────────────────┐
│              Express Backend                │
│                                             │
│ Authentication                              │
│ Interview Configuration                     │
│ Question Generation                         │
│ Answer Persistence                          │
│ Report Generation                           │
│ History                                     │
└──────────────┬─────────────────┬────────────┘
               │                 │
               │                 │
               ▼                 ▼
      ┌────────────────┐  ┌─────────────────┐
      │    MongoDB     │  │ Google Gemini   │
      │   + Mongoose   │  │   2.5 Flash     │
      └────────────────┘  └─────────────────┘
```

---

# 🔄 End-to-End Data Flow

## Step 1 — Authentication

The candidate creates an account or logs in.

```text
User
 ↓
Frontend
 ↓
Express API
 ↓
JWT Authentication
 ↓
Authenticated Session
```

---

## Step 2 — Interview Configuration

The candidate selects:

* Difficulty
* Number of questions
* Voice
* Resume/professional context

The frontend sends these values to:

```text
POST /api/v1/resume/createInterviewPattern
```

The backend creates the interview configuration and returns an interview identifier.

---

## Step 3 — Question Generation

The application requests:

```text
GET /api/v1/questions/startInterview/:id
```

The backend retrieves the interview configuration, builds the AI prompt, and sends it to Gemini.

The generated questions are then persisted as an interview session.

---

## Step 4 — Candidate Answers

Each response is sent to:

```text
POST /api/v1/useranswers/saveUserAnswer/:interviewId/:questionId
```

The answer is stored against the current interview session.

---

## Step 5 — AI Evaluation

After the final question, the frontend requests:

```text
GET /api/v1/reports/generateReport/:interviewId
```

The backend collects the conversation, generates an evaluation prompt, calls Gemini, and stores the resulting performance metrics.

---

## Step 6 — Results

The frontend displays the generated report through the protected `/results` route.

The report can then be revisited from the user's session history.

---

# 🛠️ Technology Stack

## Frontend

| Technology       | Purpose                              |
| ---------------- | ------------------------------------ |
| **React 19**     | UI development                       |
| **Vite**         | Development server and build tooling |
| **React Router** | Client-side routing                  |
| **Tailwind CSS** | Styling and responsive UI            |
| **Axios**        | HTTP communication                   |
| **Lucide React** | UI icons                             |
| **html2canvas**  | Client-side rendering utility        |
| **jsPDF**        | PDF-generation dependency            |

These dependencies are defined in the frontend package configuration.

---

## Backend

| Technology        | Purpose                             |
| ----------------- | ----------------------------------- |
| **Node.js**       | Backend runtime                     |
| **Express 5**     | REST API framework                  |
| **MongoDB**       | Database                            |
| **Mongoose**      | MongoDB ODM                         |
| **Google Gemini** | AI question generation & evaluation |
| **JWT**           | Authentication                      |
| **bcrypt**        | Password hashing                    |
| **Multer**        | File-upload handling dependency     |
| **pdf-parse**     | PDF processing dependency           |
| **Cloudinary**    | Media-storage dependency            |
| **Cookie Parser** | Cookie handling                     |
| **CORS**          | Cross-origin configuration          |
| **dotenv**        | Environment configuration           |

The current backend package manifest includes these dependencies.

---

# 📁 Project Structure

```text
Persona-AI_Interviewer/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── index.js
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── Persona Report.docx
├── starting.md
└── README.md
```

The repository currently contains separate `backend` and `frontend` applications, alongside the project report and development notes.

---

# 🚀 Getting Started

## Prerequisites

Install the following before running the project:

* Node.js
* npm
* MongoDB
* Google Gemini API key

Node.js:

https://nodejs.org/

MongoDB:

https://www.mongodb.com/

Google AI Studio:

https://aistudio.google.com/

---

# 1. Clone the Repository

```bash
git clone https://github.com/Shubham-India/Persona-AI_Interviewer.git
cd Persona-AI_Interviewer
```

---

# 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file according to the variables expected by the backend configuration.

Typical configuration includes values such as:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGIN=http://localhost:5173
```

> Do not commit API keys, database credentials, JWT secrets, or other sensitive configuration to GitHub.

---

# 3. Start the Backend

For development:

```bash
npm run dev
```

For normal execution:

```bash
npm start
```

The server starts through `backend/src/index.js` and connects to MongoDB before listening for requests.

---

# 4. Start the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend uses Vite for local development.

Then open the URL displayed by Vite, typically:

```text
http://localhost:5173
```

---

# 🔌 API Overview

The backend is organized around REST-style route groups.

| Route                 | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `/api/v1/healthcheck` | Service health check                     |
| `/api/v1/users`       | Authentication & user management         |
| `/api/v1/questions`   | Interview question generation            |
| `/api/v1/reports`     | Report generation & history              |
| `/api/v1/resume`      | Interview configuration / resume context |
| `/api/v1/useranswers` | Candidate answer storage                 |

The route registration is defined in the Express application.

### Important Endpoints

```text
POST /api/v1/users/register
POST /api/v1/users/login
POST /api/v1/users/logout
GET  /api/v1/users/me

POST /api/v1/resume/createInterviewPattern

GET  /api/v1/questions/startInterview/:id

POST /api/v1/useranswers/saveUserAnswer/:interviewId/:questionId

GET  /api/v1/reports/generateReport/:interviewId

GET  /api/v1/reports/history
```

Authentication middleware protects the interview, answer, report, and other user-specific endpoints.

---

# 🎤 Browser Voice Architecture

The current interview interface coordinates AI speech and microphone input as a continuous interaction.

```text
               AI Question
                    │
                    ▼
             Text-to-Speech
                    │
                    ▼
             Candidate Listens
                    │
                    ▼
              Microphone ON
                    │
                    ▼
            Speech-to-Text
                    │
                    ▼
              Transcript
                    │
           ┌────────┴────────┐
           ▼                 ▼
       Save & Next          Skip
           │
           ▼
       Next Question
```

The frontend explicitly stops listening while the AI is speaking and resumes microphone input after the spoken question ends.

---

# 🧠 AI Prompting Strategy

Persona.ai uses structured prompts rather than passing unformatted user data directly to the model.

### Question Generation

The question-generation system instructs Gemini to:

* Act as an expert interviewer
* Use the supplied candidate context
* Respect interview difficulty
* Generate the requested number of questions
* Return machine-readable JSON

### Evaluation

The evaluation prompt:

```text
Question
   +
Candidate Answer
   ↓
AI Interview Coach / Analytics Engine
   ↓
Overall Metrics
+
Strengths
+
Improvement Areas
+
Question-Level Analysis
```

This design allows the frontend to consume structured model output instead of having to parse arbitrary natural-language responses.

---

# 📊 Report Data Model

The evaluation layer currently works with structured fields such as:

```json
{
  "overallMetrics": {
    "score": 0,
    "correctness": "High/Medium/Low",
    "structure": "",
    "accuracy": "High/Medium/Low",
    "clarity": "High/Medium/Low",
    "confidence": "High/Medium/Low"
  },
  "feedbackLists": {
    "perfectAreas": [],
    "areasToImprove": []
  },
  "questionWiseAnalysis": []
}
```

The backend stores the AI-generated values back into the interview session before returning the completed report.

---

# 🔒 Security Considerations

The project includes several security-oriented mechanisms:

* JWT authentication
* Protected routes
* Password hashing with `bcrypt`
* HTTP-only cookie configuration in the authentication flow
* CORS configuration
* Environment-variable based secret management

The authentication controller hashes passwords and generates access/refresh tokens, while protected routes use JWT verification middleware.

For production deployment, secrets should always be stored through a secure environment/secret-management system rather than committed to source control.

---

# ⚠️ Current Project Status

**Status: 🚧 Active Development**

The current implementation already provides the core interview loop:

```text
Authentication
      ↓
Interview Setup
      ↓
AI Question Generation
      ↓
Interactive Voice Interview
      ↓
Answer Storage
      ↓
AI Evaluation
      ↓
Performance Report
      ↓
Interview History
```

However, some functionality is still under development.

### Current Limitations

**Resume PDF Upload**

The dashboard currently displays the PDF upload area as a coming-soon feature. The current interview setup therefore relies on entered/pasted resume text.

**AI Voice Provider**

The dashboard currently exposes browser-based voice functionality, while a more advanced AI voice option is marked as coming soon in the UI.

**Report Export**

The results interface contains a "Download Analysis" control and the frontend includes `html2canvas` and `jsPDF` dependencies, but the current results component does not show an attached export handler in the inspected implementation.

---

# 🗺️ Future Roadmap

Potential next-stage improvements include:

### Resume Intelligence

```text
PDF Resume
    ↓
Text Extraction
    ↓
Profile Parsing
    ↓
Skill / Experience Mapping
    ↓
Targeted Interview Questions
```

### Advanced Voice

* Higher-quality AI speech
* Better microphone handling
* Multi-language support
* More natural conversational interaction

### Smarter Interviewing

* Follow-up questions
* Adaptive difficulty
* Topic prioritization
* Job-description-aware interviews
* Role-specific interview patterns

### Analytics

* Session-to-session progress
* Skill-level tracking
* Topic weakness detection
* Interview trend analysis
* Personalized improvement plans

### Reporting

* Downloadable PDF reports
* Shareable reports
* Improved visual analytics
* Long-term candidate progress tracking

---

# 🤝 Contributing

Contributions are welcome.

To contribute:

```bash
git fork https://github.com/Shubham-India/Persona-AI_Interviewer
```

Create a feature branch:

```bash
git checkout -b feature/your-feature
```

Make your changes and verify the application.

```bash
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

Then open a Pull Request.

When contributing, keep frontend and backend responsibilities clearly separated and avoid committing secrets or local environment files.

---

# 📚 Useful Resources

### Frontend

* [React](https://react.dev/)
* [Vite](https://vite.dev/)
* [React Router](https://reactrouter.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Axios](https://axios-http.com/)

### Backend

* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://mongoosejs.com/)

### AI

* [Google AI for Developers](https://ai.google.dev/)
* [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
* [Google AI Studio](https://aistudio.google.com/)

---

# 📂 Repository Navigation

| Resource           | Link                                                                                                           |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| 🏠 Main Repository | [Persona-AI_Interviewer](https://github.com/Shubham-India/Persona-AI_Interviewer)                              |
| 🎨 Frontend        | [Open Frontend](https://github.com/Shubham-India/Persona-AI_Interviewer/tree/main/frontend)                    |
| ⚙️ Backend         | [Open Backend](https://github.com/Shubham-India/Persona-AI_Interviewer/tree/main/backend)                      |
| 📄 Project Report  | [Persona Report.docx](https://github.com/Shubham-India/Persona-AI_Interviewer/blob/main/Persona%20Report.docx) |
| 📝 Project Notes   | [starting.md](https://github.com/Shubham-India/Persona-AI_Interviewer/blob/main/starting.md)                   |

---

# 👨‍💻 Author

### Shubham

GitHub:
**[Shubham-India](https://github.com/Shubham-India)**

Repository:

**[Persona-AI_Interviewer](https://github.com/Shubham-India/Persona-AI_Interviewer)**

---

# ⭐ Support the Project

If you find Persona.ai useful, consider giving the repository a ⭐ on GitHub.

Feedback, issues, feature suggestions, and contributions are welcome.

---

<div align="center">

## 🎙️ Practice Smarter. Interview Better.

### Persona.ai

**AI-powered mock interviews with personalized questions and actionable feedback.**

</div>
