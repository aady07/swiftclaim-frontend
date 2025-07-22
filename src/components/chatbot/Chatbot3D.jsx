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
import LoginForm from '../common/LoginForm';
import ClaimUploadForm from '../claims/ClaimUploadForm';
import ClaimResults from '../claims/ClaimResults';
import { useCognitoAuth } from '../../hooks/useCognitoAuth';
import { useS3Upload } from '../../hooks/useS3Upload';

const Chatbot = ({ isFullPage = false, widgetMode = false, clientName = '', clientLogo = '', widgetSize = null }) => {
  const [language, setLanguage] = useState("en");
  const [languageSelected, setLanguageSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(isFullPage);
  const avatarInitialized = useRef(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showClaimFlow, setShowClaimFlow] = useState(false);
  const [claimResults, setClaimResults] = useState(null);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const fileInputRef = useRef(null);
  const [pendingClaim, setPendingClaim] = useState(false);
  const { user, isAuthenticated, getUserId } = useCognitoAuth();

  useEffect(() => {
    window.__CHATBOT_ACTIVE__ = true;
    return () => { window.__CHATBOT_ACTIVE__ = false; };
  }, []);

  // Claim intent handler for useChatLogic
  const onClaimIntent = async () => {
    if (!(await isAuthenticated())) {
      setPendingClaim(true);
      setIsOpen(false); // Close the chatbot
      setShowLoginModal(true);
      return;
    }
    setShowImageUpload(true); // Immediately start claim flow in chat
  };

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
    selectedFile: chatbotSelectedFile,
    setSelectedFile: setChatbotSelectedFile,
    showCarInput,
    carInput,
    setCarInput,
    uploadStatus,
    fileInputRef: chatbotFileInputRef,
    messagesEndRef,
    handleSend,
    handleKeyPress,
    startListening,
    stopListening,
    handleCarDetails,
    handleImageSelect,
    toggleMute,
    setShowCarInput,
    setShowImageUpload,
  } = useChatLogic(language, { onClaimIntent, isAuthenticated });

  const { uploadFileToS3, uploadStatus: s3UploadStatus, resetUpload } = useS3Upload();

  // After login, if pendingClaim, reload the page
  useEffect(() => {
    if (!showLoginModal && pendingClaim && user) {
      setPendingClaim(false);
      window.location.reload();
    }
  }, [showLoginModal, pendingClaim, user]);

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

  // Override claim intent logic
  const handleClaimIntent = async () => {
    if (!(await isAuthenticated())) {
      setShowLoginModal(true);
      return;
    }
    setShowClaimFlow(true);
  };

  // After login success
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setShowClaimFlow(true);
  };

  // Claim upload logic (reused from ClaimUpload)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClaimSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || !carMake.trim() || !carModel.trim()) return;
    if (uploadStatus === 'uploading') return;
    setClaimResults(null);
    setClaimError(null);
    setClaimLoading(true);
    try {
      const userId = await getUserId();
      const data = await uploadFileToS3(selectedFile, carMake, carModel, userId);
      if (data && data.claimId && data.success) {
        // Fetch results logic here (can be simplified for chatbot)
        setClaimResults(data); // Or fetch details if needed
      } else {
        setClaimError('Claim upload did not return a valid claim ID.');
      }
    } catch (error) {
      setClaimError('Claim submission error.');
    } finally {
      setClaimLoading(false);
    }
  };

  // Dynamic button styling for widget mode
  const buttonStyle = widgetMode && clientLogo ? {
    '--button-logo': `url(${clientLogo})`
  } : {};

  return (
    <>
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-xl shadow-2xl p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={() => setShowLoginModal(false)}>
              ×
            </button>
            <LoginForm onLoginSuccess={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}
      
      {/* Floating chat button - show if not fullscreen and (not in iframe OR in widgetMode) */}
      {!isFullPage && (!isInIframe || widgetMode) && (
        <>
          <div className="assistant-popup">
            {language === "en" ? "I'm your assistant! How can I help?" : "मैं आपका सहायक हूँ! मैं कैसे मदद कर सकता हूँ?"}
          </div>
          <div className="chatbot-button" onClick={toggleChatbot} style={buttonStyle}>
            {isOpen ? (
              <span className="close-icon">×</span>
            ) : (
              <div className="button-pulse"></div>
            )}
          </div>
        </>
      )}
      {/* Chat window */}
      {isOpen && (
        <div 
          className={`chatbot-container ${isFullPage ? 'fullscreen' : ''} ${widgetMode ? 'widget-mode' : ''}`}
          style={widgetMode && widgetSize ? {
            width: widgetSize.width,
            height: widgetSize.height,
            maxWidth: widgetSize.maxWidth,
            maxHeight: widgetSize.maxHeight,
            position: 'relative',
            bottom: 'auto',
            right: 'auto'
          } : {}}
        >
          {/* Header for widget mode */}
          {widgetMode ? (
            <div className="chatbot-header widget-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {clientLogo && <img src={clientLogo} alt={clientName} style={{ height: 32, width: 32, borderRadius: 6 }} />}
              <h3 style={{ margin: 0 }}>{clientName}</h3>
            </div>
          ) : !isFullPage && (
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
              {/* Only show avatar if not in widgetMode */}
              {!widgetMode && (
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
              )}
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
                selectedFile={chatbotSelectedFile}
                setSelectedFile={setChatbotSelectedFile}
                fileInputRef={chatbotFileInputRef}
                handleImageSelect={handleImageSelect}
                showCarInput={showCarInput}
                carInput={carInput}
                setCarInput={setCarInput}
                handleCarDetails={handleCarDetails}
                uploadStatus={uploadStatus}
                setShowCarInput={setShowCarInput}
                setShowImageUpload={setShowImageUpload}
                messagesEndRef={messagesEndRef}
                widgetMode={widgetMode}
                clientName={clientName}
                clientLogo={clientLogo}
                // handleClaimIntent={handleClaimIntent} // Removed as per edit hint
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;