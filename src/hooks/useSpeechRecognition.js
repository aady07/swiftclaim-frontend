import { useState } from 'react';

export const useCustomSpeechRecognition = ({ setInput, handleSend, setIsListening }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Accepts an audio blob, sends to backend STT API, and returns text
  const transcribeAudio = async (audioBlob) => {
    setIsListening(true);
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      const response = await fetch('https://aadybackend.site/api/speech/stt', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('STT API error');
      const text = await response.text();
      setInput(text);
      handleSend(text);
      setIsListening(false);
      setIsProcessing(false);
      return text;
    } catch (err) {
      setIsListening(false);
      setIsProcessing(false);
      alert('Speech recognition error. Please try again.');
      return '';
    }
  };

  return {
    transcribeAudio,
    isProcessing
  };
}; 