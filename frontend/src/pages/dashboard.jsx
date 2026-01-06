import React, { useState, useRef } from "react";
import {
  Clock,
  Mic,
  BarChart3,
  History,
  ChevronRight,
  UploadCloud,
  FileText,
  X,
  Sparkles,
  LayoutDashboard,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHistory } from "../context/historyContext";

import { useAuth } from "../context/authContext";

import { setInterviewPattern } from "../services/interviewService";


export default function Dashboard() {

  const [selectedVoice, setSelectedVoice] = useState("English(US)");
  const [selectedLevel, setSelectedLevel] = useState("Intermediate");
  const [resumeText, setResumeText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);


  const [customInput, setCustomInput] = useState("");


  // const [selectedTime, setSelectedTime] = useState("1m");
  const navigate = useNavigate();
  let interviewId = null;


  const { user, loading_auth, logout } = useAuth();

  if (loading_auth) {
    return (
      <div className="h-screen w-full bg-[#FCFBF8] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-stone-500 font-black uppercase tracking-[0.3em] text-[10px]">Verifying Identity...</p>
      </div>
    );
  }


  const fileInputRef = useRef(null);





  const { reports, loading_his } = useHistory();
  // console.log(reports)

  const handleStartInterview = async () => {
    try {

      const newSession = await setInterviewPattern({
        totalQuestions: questionCount,
        // durationMinutes: selectedTime,
        voice: selectedVoice,
        difficultyLevel: selectedLevel,
        resumeText: resumeText,

        resumeFileURL: selectedFile ? selectedFile.name : null,
      });
      console.log("New Session Created:", newSession);
      const interviewId = newSession.data?.interviewId || newSession.interviewId;

      if (!interviewId) {
        throw new Error("Interview ID not found in response");
      }


      navigate(`/interview/${interviewId}`, {
        state: { fromDashboard: true }, replace: true
      });

    } catch (error) {
      console.error("FULL ERROR DETAILS:", error.response?.data || error.message);
      alert("Failed to start interview. Configure Session 💘  Try again.");
    }
  };




  return (
    <div className="flex h-screen bg-[#FCFBF8] font-sans overflow-hidden text-stone-900">
      {/* SIDEBAR - Cream & Gold Theme */}
      {/* SIDEBAR - Compact History Blocks */}
      <aside className="w-72 bg-white border-r border-stone-200 flex flex-col hidden lg:flex shadow-sm">
        <div className="p-6 border-b border-stone-100 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-amber-200">
            <LayoutDashboard size={18} />
          </div>
          <span className="font-bold text-stone-950 tracking-tight">Persona Panel</span>
        </div>

        {/* HISTORY LIST AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="px-3 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Past Sessions</p>

          {loading_his ? (
            <p className="text-center text-[10px] font-bold animate-pulse">Loading...</p>
          ) : reports.length > 0 ? (
            reports.map((item) => (
              <div
                key={item._id || item.interviewPatternId}
                onClick={() => {

                  navigate('/results', { state: { selectedReport: item } })

                }
                }
               

                className="p-4 bg-white border border-stone-200 rounded-2xl cursor-pointer hover:border-amber-400 hover:scale-[1.03] hover:shadow-md transition-all duration-300 shadow-sm group"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[8px] font-black uppercase bg-stone-50 px-2 py-1 rounded text-stone-500">
                    {item.difficultyLevel || `N/A`}
                  </span>
                  <span className="text-sm font-black text-amber-600">
                    {item.score ?? 'N/A'}
                  </span>
                </div>

                <h3 className="font-bold text-stone-900 text-xs truncate font-serif italic group-hover:text-amber-700">
                  {item.topic || 'N/A'}
                </h3>


                <p className="text-[9px] text-stone-600 mt-2 font-mono font-bold italic border-t border-stone-50 pt-2">
                  Date: {item.createdAt.slice(0, 10) || 'Recent'}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 opacity-40">
              <p className="text-xs font-bold italic">No sessions yet</p>
            </div>
          )}
        </div>

        {/* FOOTER - Student Info */}
        <div className="p-4 border-t border-stone-100 shrink-0">
          <div className="bg-stone-900 p-4 rounded-2xl text-white shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-amber-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono italic">Premium Access 🐦‍🔥{user?.data?.fullName || ''}🐦‍🔥</p>
            </div>
            <p className="text-[11px] font-semibold opacity-90 leading-relaxed">Verified IIT Dhanbad Account</p>
            <p className="text-[11px] font-semibold opacity-90 leading-relaxed">Made With ❤️ By SHUBHAM</p>
          </div>
        </div>
      </aside>



      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER - Golden Gradient Logo */}
        <header className="h-16 flex items-center px-10 justify-between bg-white border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl drop-shadow-sm">🇮🇳</span>
              <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-stone-900 via-amber-600 to-amber-500">
                Persona<span className="text-amber-600">.ai</span>
              </h1>
            </div>
            <div className="h-4 w-[1px] bg-stone-200 mx-2"></div>
            <span className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Mock Studio</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-800 tracking-tight leading-none">Welcome {user?.data?.fullName || ''}</p>
              <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tighter">Verified Profile</p>
              <button onClick={logout}>Logout</button>
            </div>
            <div className="h-9 w-9 rounded-full bg-stone-100 border-2 border-white shadow-sm ring-2 ring-amber-50 overflow-hidden hover:ring-amber-200 transition-all cursor-pointer">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper" alt="User" />
            </div>
          </div>
        </header>


        {/* SETUP CONTENT */}
        <div className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-10 py-6 overflow-hidden">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Configure Session</h2>
              <p className="text-stone-400 text-xs font-medium">Fine-tune the AI Interviewer settings below.</p>
            </div>


            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 cursor-pointer hover:bg-amber-100 transition-colors">
              <Settings2 size={16} />
              <span className="text-[10px] font-black uppercase tracking-wider">Advanced</span>
            </div>
          </div>


          {/* TOP CONFIG CARDS - Gold Accents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 shrink-0">
           
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 hover:border-amber-300 transition-all group">

              {/* 🟢 SECTION 1: NUMBER OF QUESTIONS */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                    <span className="text-xs font-bold">#</span>
                  </div>
                  <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">
                    Questions
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    onClick={() => { setQuestionCount(5); setCustomInput(""); }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${questionCount === 5 && customInput === "" ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-400 border-stone-200 hover:bg-stone-50'}`}
                  >
                    5
                  </button>
                  <button
                    onClick={() => { setQuestionCount(10); setCustomInput(""); }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${questionCount === 10 && customInput === "" ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-400 border-stone-200 hover:bg-stone-50'}`}
                  >
                    10
                  </button>
                </div>

                {/* Manual Input */}
                <input
                  type="number"
                  min="1"
                  max="15"
                  placeholder="Custom Amount... 1 to 15"
                  value={customInput}
                  onChange={(e) => { setCustomInput(e.target.value); setQuestionCount(Number(e.target.value)); }}
                  className={`w-full px-3 py-2 rounded-xl bg-stone-50 border text-xs font-bold text-stone-900 outline-none transition-all placeholder:text-stone-300 ${customInput ? "border-amber-500 ring-1 ring-amber-50 bg-white" : "border-transparent focus:bg-white focus:border-amber-300"}`}
                />
              </div>

             


            </div>

            {/* Voice */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 hover:border-amber-300 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-stone-50 text-stone-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Mic size={18} />
                </div>
                <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">AI Voice</p>
              </div>
              <select onChange={(e) => setSelectedVoice(e.target.value)} className="w-full bg-stone-50 border-none rounded-xl text-xs p-2 font-black text-stone-600 outline-none cursor-pointer">
                <option>Browser English</option>
                <option>Browser Hindi (NOT available) </option>
                <option disabled>AI (Sophisticated) Available soon!!!</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 hover:border-amber-300 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-stone-50 text-stone-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <BarChart3 size={18} />
                </div>
                <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Difficulty</p>
              </div>
              <div className="flex gap-2">
                {["Easy", "Intermediate", "Advanced"].map((l) => (
                  <button key={l} onClick={() => setSelectedLevel(l)} className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all ${selectedLevel === l ? 'bg-stone-800 text-white shadow-lg shadow-stone-200' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'}`}>{l}</button>
                ))}
              </div>
            </div>
          </div>



          {/* ASYMMETRICAL RESUME SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 shrink-0">
            {/* About Me */}
            <div className="lg:col-span-2 flex flex-col space-y-3">
              <label className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-stone-500 uppercase tracking-[0.15em]">
                  <FileText size={14} className="text-amber-600" />
                  Your Context
                </div>
                <span className="text-[9px] text-amber-600 font-bold uppercase tracking-tighter bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">Smart Analysis Enabled</span>
              </label>
              <div className="bg-white p-1 rounded-[24px] border border-stone-200 shadow-sm focus-within:border-amber-400 focus-within:ring-4 ring-amber-50 transition-all">
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your professional summary or the specific role context..."
                  className="w-full h-32 p-5 bg-transparent outline-none text-slate-700 resize-none text-sm font-medium leading-relaxed placeholder:text-stone-300"
                />
              </div>
            </div>

            {/* PDF Upload */}
            <div className="lg:col-span-1 flex flex-col space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-stone-500 uppercase tracking-[0.15em] px-1">
                <UploadCloud size={14} className="text-amber-600" />
                Upload Resume
              </label>
              <p> Resume Upload Feature coming Soon </p>
            </div>
          </div>

          {/* START BUTTON */}
          <div className="mt-auto pt-4 border-t border-stone-100 flex flex-col items-center shrink-0">
            <button
              onClick={handleStartInterview}

              className="group relative w-full md:w-auto px-20 py-4 bg-stone-900 text-white rounded-2xl flex items-center justify-center gap-4 text-lg font-black shadow-2xl shadow-stone-200 hover:bg-amber-600 hover:-translate-y-1 active:translate-y-0 transition-all active:scale-95"
            >
              Launch Session
              <div className="p-1 bg-white/10 rounded-lg group-hover:translate-x-1.5 transition-transform duration-300">
                <ChevronRight size={22} />
              </div>
            </button>
            <div className="flex items-center gap-4 mt-4">
              <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-amber-500" /> Privacy Secured
              </p>
              <span className="w-1 h-1 bg-stone-200 rounded-full"></span>
              <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-500" /> AI Optimization Active
              </p>
            </div>
          </div>
        </div>
      </main>


      <style>{`
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        textarea::-webkit-scrollbar { width: 4px; }
        textarea::-webkit-scrollbar-thumb { background: #F1F1F1; border-radius: 10px; }
        textarea::-webkit-scrollbar-thumb:hover { background: #E2E2E2; }
      `}</style>
    </div>
  );
}