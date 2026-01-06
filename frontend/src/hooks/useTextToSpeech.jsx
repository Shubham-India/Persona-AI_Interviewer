import { useState, useRef, useEffect ,useCallback } from "react";

const useTextToSpeech = ({ onSpeakStart, onSpeakEnd } = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null)
  
  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    onSpeakEnd?.();
  }, [onSpeakEnd]);
  const speak = useCallback((text) => {

    if (!text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance

    utterance.onstart = () => {
      setIsSpeaking(true);
      onSpeakStart?.();   // 👈 mic OFF 
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onSpeakEnd?.();     // 👈 mic ON
      utteranceRef.current = null
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      onSpeakEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }, [onSpeakStart, onSpeakEnd]);


  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return { speak, stop, isSpeaking };
};

export { useTextToSpeech };
