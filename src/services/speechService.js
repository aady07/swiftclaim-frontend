import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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
    if (!browserSupportsSpeechRecognition) {
      alert(language === "en" 
        ? "Your browser does not support speech recognition." 
        : "आपका ब्राउज़र स्पीच रिकग्निशन का समर्थन नहीं करता है।");
      return;
    }
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        resetTranscript();
        setIsListening(true);
        
        SpeechRecognition.startListening({ 
          continuous: true,
          interimResults: true,
          language: language === "en" ? "en-US" : "hi-IN"
        });
      })
      .catch(error => {
        alert(language === "en" 
          ? "Microphone access is required for voice input." 
          : "वॉइस इनपुट के लिए माइक्रोफोन एक्सेस आवश्यक है।");
      });
  };

  const stopListening = (setIsListening, handleSend) => {
    const finalTranscript = transcript;
    
    setIsListening(false);
    
    SpeechRecognition.stopListening();
    
    if (finalTranscript && finalTranscript.trim()) {
      setTimeout(() => {
        handleSend(finalTranscript);
        resetTranscript();
      }, 300); 
    }
  };

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