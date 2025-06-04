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
    console.log('Starting speech recognition...');
    console.log('Browser support:', browserSupportsSpeechRecognition);
    
    if (!browserSupportsSpeechRecognition) {
      console.log('Speech recognition not supported');
      alert(language === "en" 
        ? "Your browser does not support speech recognition." 
        : "आपका ब्राउज़र स्पीच रिकग्निशन का समर्थन नहीं करता है।");
      return;
    }
    
    console.log('Requesting microphone access...');
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log('Microphone access granted');
        resetTranscript();
        setIsListening(true);
        
        try {
          console.log('Starting SpeechRecognition...');
          SpeechRecognition.startListening({ 
            continuous: true,
            interimResults: true,
            language: language === "en" ? "en-US" : "hi-IN"
          });
          console.log('SpeechRecognition started successfully');
        } catch (error) {
          console.error('Error starting SpeechRecognition:', error);
          setIsListening(false);
          alert(language === "en" 
            ? "Error starting speech recognition. Please try again." 
            : "स्पीच रिकग्निशन शुरू करने में त्रुटि। कृपया पुनः प्रयास करें।");
        }
      })
      .catch(error => {
        console.error('Microphone access error:', error);
        alert(language === "en" 
          ? "Microphone access is required for voice input." 
          : "वॉइस इनपुट के लिए माइक्रोफोन एक्सेस आवश्यक है।");
      });
  };

  const stopListening = (setIsListening, handleSend) => {
    console.log('Stopping speech recognition...');
    const finalTranscript = transcript;
    
    setIsListening(false);
    
    try {
      SpeechRecognition.stopListening();
      console.log('SpeechRecognition stopped successfully');
    } catch (error) {
      console.error('Error stopping SpeechRecognition:', error);
    }
    
    if (finalTranscript && finalTranscript.trim()) {
      console.log('Sending transcript:', finalTranscript);
      setTimeout(() => {
        handleSend(finalTranscript);
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