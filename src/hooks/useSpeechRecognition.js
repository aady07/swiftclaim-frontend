import { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
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
    // Initialize speech recognition
    if (browserSupportsSpeechRecognition) {
      console.log('Initializing speech recognition...');
      try {
        const recognition = SpeechRecognition.getRecognition();
        if (recognition) {
          recognition.lang = language === "en" ? "en-US" : "hi-IN";
          recognition.continuous = true;
          recognition.interimResults = true;
          console.log('Speech recognition initialized successfully');
        } else {
          console.error('Failed to get speech recognition instance');
        }
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
      }
    }
  }, [language, browserSupportsSpeechRecognition]);

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
      console.error('SpeechRecognition Error:', event.error);
      setIsListening(false);

      alert(language === "en"
        ? "Speech recognition error. Please try again."
        : "स्पीच रिकग्निशन त्रुटि। कृपया पुनः प्रयास करें।");
    };

    if (browserSupportsSpeechRecognition) {
      const recognition = SpeechRecognition.getRecognition();
      if (recognition) {
        recognition.addEventListener('error', handleError);
        return () => {
          recognition.removeEventListener('error', handleError);
        };
      }
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