import { useState } from 'react';

export const useUIStateService = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isTalking, setIsTalking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showCarInput, setShowCarInput] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);

  const toggleMute = () => setIsMuted(!isMuted);

  return {
    isMuted,
    setIsMuted,
    isTalking,
    setIsTalking,
    isListening,
    setIsListening,
    isTyping,
    setIsTyping,
    showImageUpload,
    setShowImageUpload,
    showCarInput,
    setShowCarInput,
    uploadStatus,
    setUploadStatus,
    isVoiceProcessing,
    setIsVoiceProcessing,
    toggleMute
  };
}; 