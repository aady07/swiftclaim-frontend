import { useEffect } from 'react';
import SpeechRecognition from 'react-speech-recognition';
import { useSpeechService } from '../services/speechService';

export const useSpeechRecognition = (language, { setInput, handleSend, setIsListening }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening: startSpeechListening,
    stopListening: stopSpeechListening
  } = useSpeechService(language);

  useEffect(() => {
    if (listening) {
      setIsListening(true);
    }
  }, [transcript, listening, setIsListening]);

  useEffect(() => {
    if (listening && transcript) {
      setInput(transcript);
    }
  }, [transcript, listening, setInput]);

  useEffect(() => {
    const handleError = (event) => {
      setIsListening(false);
      console.log("SpeechRecognition Error:", event.error);

      alert(language === "en"
        ? "Speech recognition error. Please try again."
        : "स्पीच रिकग्निशन त्रुटि। कृपया पुनः प्रयास करें।");
    };

    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.getRecognition()?.addEventListener('error', handleError);
      
      return () => {
        SpeechRecognition.getRecognition()?.removeEventListener('error', handleError);
      };
    }
  }, [language, browserSupportsSpeechRecognition, setIsListening]);

  useEffect(() => {
    if (!listening) {
      setIsListening(false);
      
      if (transcript && transcript.trim()) {
        handleSend(transcript);
        resetTranscript();
      }
    }
  }, [listening, transcript, handleSend, resetTranscript, setIsListening]);

  useEffect(() => {
    let timeoutId;
    
    if (listening) {
      timeoutId = setTimeout(() => {
        stopSpeechListening(setIsListening, handleSend);
      }, 15000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [listening, stopSpeechListening, setIsListening, handleSend]);

  return {
    startListening: () => startSpeechListening(setIsListening),
    stopListening: () => stopSpeechListening(setIsListening, handleSend),
    browserSupportsSpeechRecognition
  };
}; 