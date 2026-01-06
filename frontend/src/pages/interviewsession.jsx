import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Mic, SkipForward, StopCircle, CheckCircle, Sparkles, LogOut, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSpeechToText } from "../hooks/useSpeechTOText";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { NewInterviewQuestions, saveCurrentQuestion, generateAiAnalysis } from "../services/interviewService";
import { useAuth } from "../context/authContext";

export default function InterviewSession() {
  const Navigate = useNavigate();
  const { interviewId } = useParams();
  const { user, loading_auth } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lastSpokenIndex = useRef(-1);


  const hasFetchedRef = useRef(false);

  const { transcript, setTranscript, isListening, setIsListening, startListening, stopListening, resetTranscript } = useSpeechToText();

  const { speak, stop } = useTextToSpeech({
    onSpeakStart: () => {
      stopListening();
      setIsListening(false)
      resetTranscript();
      setShowControls(false);
    },
    onSpeakEnd: () => {
      resetTranscript();


      if (!isSubmitting) {
        setTimeout(() => {
          startListening(); // AI ke bolne ke baad mic start
          setIsListening(true);
        }, 400); // 0.4 second ka gap 
      }
    }
  });


  useEffect(() => {        // Logic of fetching the questions
    
    const fetchQuestions = async () => {
      try {
        if (!interviewId) return;


        if (hasFetchedRef.current) {
          setLoading(false)
          return
        };


        const cachedData = sessionStorage.getItem(`questions_${interviewId}`);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData)
          setQuestions(parsedData);
          setLoading(false);
          hasFetchedRef.current = true;
          return;
        }


        setLoading(true);

        const res = await NewInterviewQuestions(interviewId, controller.signal);
        const rawData = res.data?.rawResponse || res.rawResponse;
        const questionsArray = rawData?.questions || [];
        hasFetchedRef.current = true;

        if (questionsArray.length > 0) {
          const data = questionsArray.map((q) => ({ text: q.questionText || q.question }));
          setQuestions(data);
          sessionStorage.setItem(`questions_${interviewId}`, JSON.stringify(data));
        }
      } catch (err) {


        if (axios.isCancel(err)) {
          console.log("Strict Mode: Pehli request cancel ho gayi.");
        }
        else {

          console.error("Fetch Error:", err);
        }
        hasFetchedRef.current = false;
      } finally {
       
        setLoading(false);

      }
    };

    fetchQuestions();
  }, [interviewId]);





  console.log("Questions aaya", questions)
  const currentQuestionText = questions[currentQuestionIndex]?.text || "";

  useEffect(() => {
    if (!loading && questions.length > 0 && currentQuestionIndex > lastSpokenIndex.current) {

      window.isListeningForRestart = false;
      // setIsListening(false)
      const textToSpeak = questions[currentQuestionIndex]?.text;
      stopListening();
      setTranscript("");
      setShowControls(false);
      stop()
      if (textToSpeak) {
        setTimeout(() => {
          speak(textToSpeak);
          lastSpokenIndex.current = currentQuestionIndex;
        }, 200);


      }
    }
    return () => stop();  // bolna band kar
  }, [currentQuestionIndex, questions, loading]);



  const handleStopAnalysis = () => {
    window.speechSynthesis.cancel();
    stopListening();
    setIsListening(false)
    setShowControls(true);
  };




  const handleAction = async (isSkip = false) => {
    const answerToSave = isSkip ? "" : transcript;

    try {
      stop();
      stopListening();


      await saveCurrentQuestion(interviewId, currentQuestionIndex + 1, answerToSave);
      setTranscript("");

      if (currentQuestionIndex < questions.length - 1) {
        setShowControls(false);
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setIsSubmitting(true);

        stopListening();

        const result = await generateAiAnalysis(interviewId);
        sessionStorage.removeItem(`questions_${interviewId}`); // Ab safe hai


        if (result) window.location.href = "/results";

      }
    } catch (error) {
      console.error("Save Error", error);
      setIsSubmitting(false);
      alert("Error saving response.");
    }
  };



  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
        {/* Center Content */}
        <div className="text-center space-y-6">

          {/* Animated Icon / Logo Area */}
          <div className="relative">
            <div className="w-20 h-20 border-4 border-stone-100 border-t-amber-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-amber-500 rounded-lg rotate-45 animate-pulse"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Setting up your Interview
            </h2>
            <p className="text-stone-400 font-medium animate-pulse">
              AI is preparing questions for you...
            </p>
          </div>

        </div>

        {/* Footer Branding (Optional) */}
        <div className="absolute bottom-10 text-stone-300 text-xs font-bold uppercase tracking-[0.2em]">
          AI Interviewer v1.0
        </div>
      </div>
    );
  };

  if (loading_auth) {
    return (
      <div className="h-screen w-full bg-[#FCFBF8] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="h-screen w-screen bg-[#FCFBF8] flex flex-col items-center justify-center animate-fadeIn">
        <Loader2 size={64} className="text-amber-600 animate-spin mb-6" />
        <h2 className="text-2xl font-black text-stone-800 tracking-tight">Generating Your Analysis...</h2>
        <p className="text-stone-500 mt-2 font-medium">Please wait while our AI evaluates your answers.</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#FCFBF8] flex flex-col overflow-hidden text-stone-900">
      <header className="h-16 flex items-center px-10 justify-between bg-white border-b border-stone-200 shrink-0">
        <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-stone-950 via-amber-600 to-amber-500">
          Persona<span className="text-amber-600">.ai</span>
        </h1>
        <div className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
          <p className="text-sm font-bold">{user?.fullName}</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute top-6 right-10 flex gap-3 z-10">
          <div className="bg-white border border-stone-200 px-4 py-2 rounded-xl text-center min-w-[80px] shadow-sm">
            <p className="text-[9px] font-black text-stone-400 uppercase">Answered</p>
            <p className="text-sm font-bold">{answeredCount}</p>
          </div>
          <div className="bg-white border border-stone-200 px-4 py-2 rounded-xl text-center min-w-[80px] shadow-sm">
            <p className="text-[9px] font-black text-stone-400 uppercase">Skipped</p>
            <p className="text-sm font-bold">{skippedCount}</p>
          </div>
        </div>

        {/* Question Area - FULL WIDTH */}
        <div className="flex-1 flex flex-col items-center justify-center text-center w-full px-4 md:px-12 lg:px-20">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles size={20} className="text-amber-500" />
            <span className="text-xs md:text-sm font-black text-amber-700 uppercase tracking-[0.2em]">
              Question {currentQuestionIndex + 1}
            </span>
          </div>
          <h2 className="w-full text-3xl md:text-4xl lg:text-5xl text-stone-950 font-serif font-bold italic leading-tight break-words animate-fadeIn transition-all duration-300">
            "{currentQuestionText}"
          </h2>
          <div className={`mt-8 h-12 flex items-end gap-1 ${isListening ? 'opacity-100' : 'opacity-0'}`}>
            {/* Sirf 5 bars jo thoda natural aur simple lagein */}
            <div className="w-2 bg-amber-500 rounded-full animate-bounce h-8" />
            <div className="w-2 bg-amber-500 rounded-full animate-bounce h-12 [animation-delay:0.2s]" />
            <div className="w-2 bg-amber-500 rounded-full animate-bounce h-6 [animation-delay:0.4s]" />
            <div className="w-2 bg-amber-500 rounded-full animate-bounce h-10 [animation-delay:0.1s]" />
            <div className="w-2 bg-amber-500 rounded-full animate-bounce h-7 [animation-delay:0.3s]" />
          </div>
        </div>

        <div className="px-10 pb-12 w-full max-w-5xl mx-auto">
          <div className={`bg-white p-2 rounded-[40px] border shadow-2xl transition-all duration-300 ${isListening ? "border-amber-400 ring-8 ring-amber-50" : "border-stone-200"}`}>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={isListening ? "I'm listening... Speak now." : "Please wait for the AI to finish speaking..."}
              className="w-full h-44 p-8 bg-transparent outline-none text-stone-900 text-lg font-semibold resize-none placeholder:text-stone-300"
              readOnly={!isListening && !showControls}
            />
          </div>

          <div className="flex justify-center gap-4 mt-10 min-h-[80px]">
            {isListening ? (
              <button
                onClick={handleStopAnalysis}
                className="flex items-center gap-3 px-12 py-5 bg-red-50 text-red-600 border border-red-100 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl animate-pulse hover:bg-red-100 transition-colors"
              >
                <StopCircle size={22} /> Stop Analysis
              </button>
            ) : showControls ? (
              <div className="flex gap-4 animate-fadeIn">
                <button
                  onClick={() => { setAnsweredCount(c => c + 1); handleAction(false); }}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-5 rounded-[24px] font-black text-xs uppercase shadow-xl transition-transform active:scale-95"
                >
                  <CheckCircle size={20} /> Save & Next
                </button>
                <button
                  onClick={() => { setSkippedCount(c => c + 1); handleAction(true); }}
                  className="flex items-center gap-2 bg-white border border-stone-200 text-stone-400 hover:text-stone-600 px-8 py-5 rounded-[24px] font-black text-xs uppercase transition-colors"
                >
                  <SkipForward size={20} /> Skip
                </button>
                <button
                  onClick={startListening}
                  className="flex items-center gap-2 bg-stone-950 text-white hover:bg-stone-800 px-8 py-5 rounded-[24px] font-black text-xs uppercase transition-colors"
                >
                  <Mic size={20} /> Start Mic Again
                </button>
                <button
                  onClick={() => {
                    sessionStorage.removeItem(`questions_${interviewId}`);
                    Navigate("/dashboard");
                  }}
                  className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-8 py-5 rounded-[24px] font-black text-xs uppercase transition-colors"
                >
                  <LogOut size={20} /> End Test
                </button>
              </div>
            ) : (
              <p className="text-stone-400 font-bold italic animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                AI is speaking, please wait...
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave { 0%, 100% { height: 20%; } 50% { height: 100%; } }
        .animate-wave { animation: wave 1s ease-in-out infinite; transform-origin: bottom; }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}




