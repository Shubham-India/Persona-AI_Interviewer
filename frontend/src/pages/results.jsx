import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle, BarChart3, Mic, AlertTriangle,
  Home, Download, Sparkles, TrendingUp,
  Target, Zap, LayoutDashboard, ShieldCheck, X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useHistory } from '../context/historyContext';


export default function ResultPage() {
  const navigate = useNavigate();
  const [currentReport, setCurrentReport] = useState(null);
  const { user, loading_auth } = useAuth();
  const location = useLocation()


  const { reports, loading_his } = useHistory();
  console.log("User :", user);

  useEffect(() => {
    if (reports.length > 0 && !currentReport) {
      setCurrentReport(location.state?.selectedReport || reports[0]);
    }
  }, [reports, currentReport]);




  if (loading_auth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#FCFBF8]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 font-bold text-stone-500">Persisting Session...</p>
      </div>
    );
  }

  if (loading_his) {
    return (
      <div className="h-screen w-full bg-[#FCFBF8] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-stone-500 font-black uppercase tracking-[0.3em] text-[10px]">Showing Reports....</p>
      </div>
    );
  }


  if (reports.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FCFBF8]">
        <AlertTriangle className="text-amber-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-stone-800">No Reports Found</h2>
        <p className="text-stone-400 text-sm mt-2">Complete an interview to generate your first analysis.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-6 px-8 py-3 bg-stone-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FCFBF8] font-sans overflow-hidden text-slate-900">

      {/* --- SIDEBAR --- */}
      <aside className="w-80 bg-white border-r border-stone-200 flex flex-col hidden lg:flex shadow-sm">
        <div className="p-6 border-b border-stone-100 flex items-center gap-3 shrink-0">
          <div
            onClick={() => navigate('/dashboard')}
            className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-amber-200 cursor-pointer hover:rotate-6 transition-transform"
          >
            <LayoutDashboard size={18} />
          </div>
          <span className="font-bold text-stone-950 tracking-tight">Persona Panel</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <p className="px-3 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Past Sessions ({reports.length})</p>

          {reports.map((item) => (
            <div
              key={item._id || item.interviewPatternId}
              onClick={() => setCurrentReport(item)}
              className={`p-5 rounded-[24px] cursor-pointer transition-all duration-300 shadow-sm border group relative overflow-hidden ${currentReport?._id === item._id
                ? 'border-amber-500 bg-amber-50/40 scale-[1.02] shadow-md'
                : 'bg-white border-stone-100 hover:border-amber-400 hover:scale-[1.03] hover:shadow-xl'
                }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${item.difficultyLevel === 'Advanced' ? 'bg-red-50 text-red-600' : 'bg-stone-100 text-stone-500'}`}>
                  {item.difficultyLevel || 'NAN'}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-stone-900 leading-none">{item.score ?? 'NA'}</span>
                  <span className="text-[8px] font-bold text-amber-600 uppercase tracking-tighter">Acc: {item.accuracy || 0}</span>
                </div>
              </div>

              <h3 className={`font-bold text-xs mb-3 font-serif italic leading-snug group-hover:text-amber-800 ${currentReport?._id === item._id ? 'text-amber-900' : 'text-stone-800'}`}>
                {item.topic || 'NAN'}
              </h3>

              <div className="pt-3 border-t border-stone-100 flex justify-between items-center">
                <span className="text-[9px] font-bold text-stone-700 uppercase tracking-tighter">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : "Recent"}
                </span>
                <span className="text-[8px] font-mono text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded">
                  ID: {item._id?.slice(-4) || "N/A"}
                </span>
              </div>

              {currentReport?._id === item._id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
              )}
            </div>
          ))}
        </div>
      </aside>


      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center px-10 justify-between bg-white border-b border-stone-200 shrink-0">
          {/* Left Side: Logo Only */}
          <div className="flex items-center">
            <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-stone-900 via-amber-600 to-amber-500">
              Persona<span className="text-amber-600">.ai</span>
            </h1>
          </div>

          {/* Right Side: User Details & Close Button */}
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              {/* Chota Label aur Bold Name */}
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">
                Interviewer Panel
              </p>
              <p className="text-sm font-black text-stone-900 leading-none">
                {user?.data?.fullName || user?.fullName || "Guest User"}
              </p>
            </div>

            {/* Divider Line */}
            <div className="h-8 w-[1px] bg-stone-200"></div>

            {/* Close Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-stone-50 rounded-full text-stone-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          <div className="max-w-5xl mx-auto">

            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{currentReport?.topic || "Select a Report"}</h2>
                <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Report ID: #{currentReport?._id || "N/A"}</p>
              </div>
              <button className="px-6 py-3 bg-stone-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center gap-2 shadow-xl shadow-stone-200">
                <Download size={14} /> Download Analysis
              </button>
            </div>

            {/* Score & AI Narrative */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-4 bg-white border border-stone-200 rounded-[32px] p-10 flex flex-col items-center justify-center relative shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500 rounded-t-full" />
                <div className="text-center">
                  <span className="text-7xl font-black text-slate-900">{currentReport?.score || 0}</span>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-2">Overall Score</p>
                </div>
              </div>

              <div className="lg:col-span-8 bg-stone-900 rounded-[32px] p-10 text-white flex flex-col justify-center relative shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5"><Sparkles size={100} /></div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white"><Zap size={18} fill="currentColor" /></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">AI Narrative Insight</span>
                </div>
                <h3 className="text-xl font-bold mb-3 italic">"Command over concepts is {currentReport?.score > 75 ? 'Excellent' : 'Developing'}."</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  Your session shows a confidence level of {currentReport?.confidence || 0}. The AI observed {currentReport?.structure || "logical flow"} in your technical explanations.
                </p>
              </div>
            </div>

            

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

              {/* Box 1: Correctness */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between h-32">
                <div className="flex items-center justify-between">
                  {/* Icon ko blue-ish/bright touch diya hai */}
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <ShieldCheck size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Correctness</span>
                </div>
                <p className="text-2xl font-black text-slate-800">{currentReport?.correctness || 0}</p>
              </div>

              {/* Box 2: Accuracy */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between h-32">
                <div className="flex items-center justify-between">
                  {/* Green/Bright touch */}
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Target size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Accuracy</span>
                </div>
                <p className="text-2xl font-black text-slate-800">{currentReport?.accuracy || 0}</p>
              </div>

              {/* Box 3: Confidence */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between h-32">
                <div className="flex items-center justify-between">
                  {/* Amber/Orange touch */}
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <TrendingUp size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Confidence</span>
                </div>
                <p className="text-2xl font-black text-slate-800">{currentReport?.confidence || 0}</p>
              </div>

              {/* Box 4: Level */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between h-32">
                <div className="flex items-center justify-between">
                  {/* Purple touch */}
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                    <BarChart3 size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Level</span>
                </div>
                <p className="text-2xl font-black text-slate-800">{currentReport?.difficultyLevel || 'Standard'}</p>
              </div>

            </div>



            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white border border-stone-200 p-8 rounded-[32px] shadow-sm">
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-800 mb-8 flex items-center gap-2">
                  <div className="h-4 w-1 bg-amber-500 rounded-full" /> Strong Foundations
                </h4>
                <ul className="space-y-4">
                  {currentReport?.feedBack?.perfect_areas?.map((area, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium text-slate-600 italic">
                      <CheckCircle size={16} className="text-amber-500 mt-1 shrink-0" /> {area}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-stone-200 p-8 rounded-[32px] shadow-sm">
                <h4 className="font-black text-xs uppercase tracking-widest text-stone-400 mb-8 flex items-center gap-2">
                  <div className="h-4 w-1 bg-stone-200 rounded-full" /> Focus Points
                </h4>
                <ul className="space-y-4">
                  {currentReport?.feedBack?.improvements?.map((imp, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium text-stone-500">
                      <AlertTriangle size={16} className="text-stone-300 mt-1 shrink-0" /> {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Transcript Breakdown */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 bg-stone-900 rounded-full" />
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-800">Transcript & AI Feedback</h4>
              </div>
              <div className="space-y-6">
                {currentReport?.conversation?.map((qa, index) => (
                  <div key={index} className="bg-white border border-stone-200 rounded-[32px] overflow-hidden shadow-sm">
                    <div className="p-6 bg-stone-50 border-b border-stone-100 flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-stone-900 text-white rounded-xl flex items-center justify-center font-black text-xs">Q{index + 1}</span>
                      <p className="font-bold text-slate-800 text-sm leading-relaxed">{qa.question}</p>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Your Response</p>
                        <div className="p-5 bg-[#FCFBF8] border border-stone-100 rounded-2xl italic text-xs text-stone-600 leading-relaxed">"{qa.answer || "N/A"}"</div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2"><Sparkles size={12} /> AI Evaluation</p>
                        <div className="p-5 bg-amber-50/30 border border-amber-100 rounded-2xl text-xs text-amber-900 leading-relaxed font-medium">
                          {currentReport.feedbackperquestion?.[index]?.improvementTip || "Good response structure."}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Action */}
            <div className="mt-16 flex flex-col items-center">
              <button onClick={() => navigate('/dashboard')} className="px-20 py-5 bg-stone-900 text-white rounded-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-amber-600 transition-all hover:-translate-y-1">
                Return to Dashboard <Home size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}