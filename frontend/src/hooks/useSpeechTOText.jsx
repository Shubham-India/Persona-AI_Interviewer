import { useState, useRef, useEffect, useCallback } from "react";

export const useSpeechToText = (lang = "en-US") => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  
  
  const isStartedRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Browser does not support Speech Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;


// Engine ka events -> onstart, onend, onresult, onerror



    recognition.onresult = (event) => {
      let currentText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          setTranscript((prev) => prev + (prev ? " " : "") + result[0].transcript.trim());
        }
      }
    };




   recognition.onerror = (event) => {
  if (event.error === 'no-speech') {    // Dont do anything.
    
    return;
  }
  setIsListening(false);
  window.isListeningForRestart = false; // no restart from any error apart from it.
};


    
    recognition.onstart = () => {
      setTranscript("");
      setIsListening(true);
      // window.isListeningForRestart = true; // Global flag 
      isStartedRef.current = true;
    };


    recognition.onend = () => {
      isStartedRef.current = false;
      setIsListening(false);
      if (window.isListeningForRestart) {
         try {
           recognition.start();
         } catch (e) {
           console.log("Restart failed:", e.message);
         }
      }else{
        setIsListening(false)
      }
    };



    recognitionRef.current = recognition;

    return () => {
      window.isListeningForRestart = false;
      recognition.stop();
    };
  }, [lang]); 

  const startListening = useCallback(() => {
    if (isStartedRef.current || window.speechSynthesis.speaking) {
    console.log("AI is still speaking, mic start prevented.");
    return;
  }

window.isListeningForRestart = true;
    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.error("Start Error Caught:", error.message);
    }
  }, []);

  const stopListening = useCallback(() => {
    window.isListeningForRestart = false;
    setIsListening(false);
    isStartedRef.current = false;
    
    try {
      recognitionRef.current?.stop();
    } catch (error) {
      console.error("Stop Error Caught:", error.message);
    }
  }, []);

  const resetTranscript = () => setTranscript("");

  return { transcript, setTranscript, isListening,setIsListening, startListening, stopListening, resetTranscript };
};