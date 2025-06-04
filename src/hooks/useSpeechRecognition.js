import { useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechService } from '../services/speechService';

export const useCustomSpeechRecognition = (language, { setInput, handleSend, setIsListening }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening: startSpeechListening,
    stopListening: stopSpeechListening
  } = useSpeechService(language);

  const isProcessingRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      try {
        const recognition = SpeechRecognition.getRecognition();
        if (recognition) {
          recognition.lang = language === "en" ? "en-US" : "hi-IN";
          recognition.continuous = true;
          recognition.interimResults = true;
        }
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (browserSupportsSpeechRecognition) {
        try {
          SpeechRecognition.stopListening();
        } catch (error) {
          console.error('Error stopping speech recognition during cleanup:', error);
        }
      }
    };
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
      isProcessingRef.current = false;

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
    if (!listening && !isProcessingRef.current) {
      setIsListening(false);
      
      if (transcript && transcript.trim()) {
        isProcessingRef.current = true;
        
        setTimeout(() => {
          if (transcript.trim().length > 0) {
            handleSend(transcript);
            resetTranscript();
          }
          
          timeoutRef.current = setTimeout(() => {
            isProcessingRef.current = false;
          }, 2000);
        }, 500);
      }
    }
  }, [listening, transcript, handleSend, resetTranscript, setIsListening]);

  useEffect(() => {
    let timeoutId;
    
    if (listening) {
      timeoutId = setTimeout(() => {
        stopSpeechListening(setIsListening, handleSend);
      }, 30000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [listening, stopSpeechListening, setIsListening, handleSend]);

  return {
    startListening: () => {
      if (!isProcessingRef.current) {
        resetTranscript();
        startSpeechListening(setIsListening);
      }
    },
    stopListening: () => {
      if (!isProcessingRef.current) {
        stopSpeechListening(setIsListening, handleSend);
      }
    },
    browserSupportsSpeechRecognition
  };
}; 