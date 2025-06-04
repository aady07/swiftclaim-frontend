import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

let isProcessing = false;
let recognitionTimeout = null;
let speechBuffer = '';
let lastSpeechTime = 0;
const MIN_SPEECH_DURATION = 500; // Minimum duration in ms to consider as valid speech
const SPEECH_END_DELAY = 1000; // Delay in ms to wait for speech to end
let isSending = false; // Flag to prevent multiple sends
let finalTranscriptBuffer = ''; // Buffer for final transcript

export const useSpeechService = (language) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const speak = (text, isMuted) => {
    if (!isMuted && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "en" ? "en-US" : "hi-IN";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = (setIsListening) => {
    if (isProcessing || isSending) {
      return;
    }
    
    if (!browserSupportsSpeechRecognition) {
      alert(language === "en" 
        ? "Your browser does not support speech recognition." 
        : "आपका ब्राउज़र स्पीच रिकग्निशन का समर्थन नहीं करता है।");
      return;
    }
    
    speechBuffer = '';
    finalTranscriptBuffer = '';
    lastSpeechTime = Date.now();
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        if (recognitionTimeout) {
          clearTimeout(recognitionTimeout);
          recognitionTimeout = null;
        }
        
        try {
          SpeechRecognition.stopListening();
        } catch (error) {
          console.error('Error stopping existing recognition:', error);
        }
        
        resetTranscript();
        setIsListening(true);
        isProcessing = true;
        
        try {
          SpeechRecognition.startListening({ 
            continuous: true, // Keep continuous to capture complete phrases
            interimResults: true, // Enable interim results to build complete phrase
            language: language === "en" ? "en-US" : "hi-IN"
          });
        } catch (error) {
          console.error('Error starting SpeechRecognition:', error);
          setIsListening(false);
          isProcessing = false;
          alert(language === "en" 
            ? "Error starting speech recognition. Please try again." 
            : "स्पीच रिकग्निशन शुरू करने में त्रुटि। कृपया पुनः प्रयास करें।");
        }
      })
      .catch(error => {
        console.error('Microphone access error:', error);
        isProcessing = false;
        alert(language === "en" 
          ? "Microphone access is required for voice input." 
          : "वॉइस इनपुट के लिए माइक्रोफोन एक्सेस आवश्यक है।");
      });
  };

  const stopListening = (setIsListening, handleSend) => {
    if (!isProcessing || isSending) {
      return;
    }
    
    setIsListening(false);
    isProcessing = false;
    
    try {
      SpeechRecognition.stopListening();
    } catch (error) {
      console.error('Error stopping SpeechRecognition:', error);
    }
    
    // Check if the speech duration is long enough
    const speechDuration = Date.now() - lastSpeechTime;
    if (speechDuration < MIN_SPEECH_DURATION) {
      return;
    }
    
    // Use the final transcript buffer
    const finalTranscript = finalTranscriptBuffer || transcript;
    
    if (finalTranscript && finalTranscript.trim()) {
      isSending = true;
      
      // Wait for speech to end before sending
      recognitionTimeout = setTimeout(() => {
        handleSend(finalTranscript.trim());
        recognitionTimeout = null;
        // Reset sending flag after a delay
        setTimeout(() => {
          isSending = false;
          finalTranscriptBuffer = ''; // Clear the buffer after sending
        }, 1000);
      }, SPEECH_END_DELAY);
    }
  };

  // Update the final transcript buffer when we get a complete phrase
  if (transcript && !listening) {
    finalTranscriptBuffer = transcript;
  }

  return {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    speak,
    startListening,
    stopListening
  };
}; 