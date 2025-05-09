import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';
import "./Chatbot3D.css";
import Avatar from "./Avatar";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import HumanoidAvatar from "./HumanoidAvatar";
import LanguagePicker from "./LanguagePicker";
import ChatInterface from "./ChatInterface";
import { useChatLogic } from '../../hooks/useChatLogic';

const Chatbot = ({ isFullPage = false }) => {
  const [language, setLanguage] = useState("en");
  const [languageSelected, setLanguageSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(isFullPage);
  const avatarInitialized = useRef(false);

  const {
    messages,
    setMessages,
    input,
    setInput,
    isMuted,
    isTalking,
    isListening,
    emotion,
    isTyping,
    showImageUpload,
    selectedFile,
    setSelectedFile,
    showCarInput,
    carInput,
    setCarInput,
    uploadStatus,
    fileInputRef,
    messagesEndRef,
    handleSend,
    handleKeyPress,
    startListening,
    stopListening,
    handleCarDetails,
    handleImageSelect,
    toggleMute,
    setShowCarInput,
    setShowImageUpload
  } = useChatLogic(language);

  // Reset avatar initialization when chatbot is closed
  useEffect(() => {
    if (!isOpen) {
      avatarInitialized.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isFullPage) {
      setIsOpen(true);
    }
  }, [isFullPage]);

  // Add iframe detection and ID handling
  const isInIframe = window !== window.parent;
  const urlParams = new URLSearchParams(window.location.search);
  const iframeId = urlParams.get('id');

  // Modify the toggleChatbot function
  const toggleChatbot = () => {
    if (!isFullPage) {
      setIsOpen(!isOpen);
      // If in iframe, notify parent window
      if (isInIframe) {
        window.parent.postMessage({
          type: 'CHATBOT_TOGGLE',
          isOpen: !isOpen,
          id: iframeId
        }, '*');
      }
    }
  };

  // Add message listener for iframe communication
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'CHATBOT_TOGGLE') {
        // Verify the ID matches
        if (event.data.id === iframeId) {
          setIsOpen(event.data.isOpen);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [iframeId]);

  // Initialize welcome message based on selected language
  useEffect(() => {
    if (languageSelected) {
      const welcomeMessage = language === "en" 
        ? "Hello! I'm your virtual assistant. How can I help you today?" 
        : "नमस्ते! मैं आपका वर्चुअल असिस्टेंट हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?";
      
      setMessages([{ text: welcomeMessage, fromBot: true }]);
    }
  }, [languageSelected, language]);

  const selectLanguage = (langCode) => {
    setLanguage(langCode);
    setLanguageSelected(true);
  };

  return (
    <>
      {/* Floating chat button - only show if not in iframe or not fullscreen */}
      {!isFullPage && !isInIframe && (
        <div className="chatbot-button" onClick={toggleChatbot}>
          {isOpen ? (
            <span className="close-icon">×</span>
          ) : (
            <div className="button-pulse"></div>
          )}
        </div>
      )}
      
      {/* Chat window */}
      {isOpen && (
        <div className={`chatbot-container ${isFullPage ? 'fullscreen' : ''}`}>
          {!isFullPage && (
            <div className="chatbot-header">
              <h3>{language === "en" ? "Enterprise Assistant" : "उद्यम सहायक"}</h3>
              <div className="header-controls">
                <button className="close-btn" onClick={toggleChatbot}>×</button>
              </div>
            </div>
          )}
          
          {!languageSelected ? (
            <div className="language-selection-container">
              <LanguagePicker selectedLanguage={language} onSelectLanguage={selectLanguage} />
            </div>
          ) : (
            <>
              <div className="avatar-container">
                <Canvas
                  gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
                  camera={{
                    position: isFullPage ? [0, 0.5, 2.5] : [0, 1.6, 1.0],
                    fov: isFullPage ? 35 : 25,
                    near: 0.1,
                    far: 1000
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight
                      intensity={1.5}
                      position={[5, 5, 5]}
                      castShadow
                    />
                    <directionalLight 
                      intensity={1} 
                      position={[-5, 5, 5]} 
                    />
                    
                    <Avatar 
                      isTalking={isTalking} 
                      emotion={emotion} 
                      isFullPage={isFullPage}
                      key={`${isFullPage}-${avatarInitialized.current}`}
                    />
                    
                    <OrbitControls 
                      enableZoom={isFullPage}
                      minPolarAngle={Math.PI/2 - (isFullPage ? 0.4 : 0.2)}
                      maxPolarAngle={Math.PI/2 + (isFullPage ? 0.4 : 0.2)}
                      minAzimuthAngle={isFullPage ? -Math.PI/4 : -Math.PI/6}
                      maxAzimuthAngle={isFullPage ? Math.PI/4 : Math.PI/6}
                    />
                  </Suspense>
                </Canvas>
                
                {/* Speaking indicator */}
                {isTalking && (
                  <div className="speak-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>

              <ChatInterface
                messages={messages}
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                handleKeyPress={handleKeyPress}
                isTyping={isTyping}
                isListening={isListening}
                startListening={startListening}
                stopListening={stopListening}
                isMuted={isMuted}
                toggleMute={toggleMute}
                language={language}
                showImageUpload={showImageUpload}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                fileInputRef={fileInputRef}
                handleImageSelect={handleImageSelect}
                showCarInput={showCarInput}
                carInput={carInput}
                setCarInput={setCarInput}
                handleCarDetails={handleCarDetails}
                uploadStatus={uploadStatus}
                setShowCarInput={setShowCarInput}
                setShowImageUpload={setShowImageUpload}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;