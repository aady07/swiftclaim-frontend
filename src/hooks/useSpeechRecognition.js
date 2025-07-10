import { useState } from 'react';
import { authenticatedApiService } from '../services/api/authenticatedApiService';

export const useCustomSpeechRecognition = ({ setInput, handleSend, setIsListening }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Accepts an audio blob, sends to backend STT API, and returns text
  const transcribeAudio = async (audioBlob) => {
    setIsListening(true);
    setIsProcessing(true);
    try {
      const text = await authenticatedApiService.speech.speechToText(audioBlob);
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