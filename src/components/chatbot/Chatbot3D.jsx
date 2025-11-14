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

const Chatbot = ({ isFullPage = false, widgetMode = false, clientName = '', clientLogo = '', widgetSize = null, clientTheme = null }) => {
  const [language, setLanguage] = useState("en");
  const [languageSelected, setLanguageSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(isFullPage);
  const avatarInitialized = useRef(false);
  const introTimeoutRef = useRef(null);
  const isVKai = Boolean(widgetMode && (clientName || '').toLowerCase().includes('vkai'));
  const isTripMall = Boolean(widgetMode && (clientName || '').toLowerCase().includes('tripmall'));

  const t = (englishText, hindiText, teluguText = englishText) => {
    if (language === "hi") return hindiText;
    if (language === "te") return teluguText;
    return englishText;
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
    setShowImageUpload,
    isVoiceProcessing
  } = useChatLogic(language, { 
    disableClaims: Boolean(widgetMode && (clientName || '').toLowerCase().includes('vkai')),
    isTripMall: Boolean(widgetMode && (clientName || '').toLowerCase().includes('tripmall'))
  });

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

  // Initialize welcome messages after language is selected
  // Show a two-part, non-typing introduction depending on client (Miraista vs VKai vs TripMall)
  useEffect(() => {
    if (!languageSelected) return;
    if (messages && messages.length > 0) return;

    const isVKaiLocal = Boolean(widgetMode && (clientName || '').toLowerCase().includes('vkai'));

    if (isTripMall) {
      // TripMall waits for user to say "hi" first - no automatic messages
      return;
    }

    const miraistaIntro = t(
      "Miraista delivers AI solutions in computer vision and analytics, from vehicle damage assessment to industry-wide innovation.",
      "मिराइस्ता कंप्यूटर विज़न और एनालिटिक्स में एआई समाधान प्रदान करती है, वाहन क्षति आकलन से लेकर व्यापक उद्योग नवाचार तक।",
      "మిరైస్టా కంప్యూటర్ విజన్ మరియు అనలిటిక్స్‌లో ఏఐ పరిష్కారాలను అందిస్తోంది, వాహన నష్టం అంచనా నుంచి పరిశ్రమవ్యాప్త ఆవిష్కరణల వరకు."
    );
    const vkaiIntro = t(
      "VKai is a social enterprise dedicated to the empowerment of marginalized communities. VKai integrates grassroots action, strategic advisory, and market driven solutions to build an equitable, self-reliant, and inclusive society.",
      "वीकाई एक सामाजिक उद्यम है जो वंचित समुदायों के सशक्तिकरण के लिए समर्पित है। वीकाई जमीनी कार्रवाई, रणनीतिक सलाह और बाज़ार-प्रधान समाधानों को जोड़कर एक न्यायसंगत, आत्मनिर्भर और समावेशी समाज का निर्माण करती है।",
      "వీకై అణచివేయబడ్డ సమూహాల సాధికారతకు కట్టుబడి ఉన్న సామాజిక సంస్థ. వీకై పునాది స్థాయి చర్యలను, వ్యూహాత్మక సలహాలను, మార్కెట్ ఆధారిత పరిష్కారాలను ఏకీకృతం చేసి సమానత్వం, స్వావలంబన, సమగ్రత కలిగిన సమాజాన్ని నిర్మిస్తుంది."
    );

    const introMessage = isVKaiLocal ? vkaiIntro : miraistaIntro;
    const helpMessage = t(
      "How may I help you today.",
      "मैं आज आपकी कैसे सहायता कर सकता हूँ?",
      "ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?"
    );

    setMessages([{ text: introMessage, fromBot: true, intro: true }]);
    introTimeoutRef.current = setTimeout(() => {
      setMessages(prev => [...prev, { text: helpMessage, fromBot: true, intro: true }]);
    }, 500);

    return () => {
      if (introTimeoutRef.current) {
        clearTimeout(introTimeoutRef.current);
        introTimeoutRef.current = null;
      }
    };
  }, [languageSelected, widgetMode, clientName, isTripMall]);

  // Auto-select language and skip picker for TripMall
  useEffect(() => {
    if (isTripMall) {
      setLanguage('en');
      setLanguageSelected(true);
    }
  }, [isTripMall]);

  const selectLanguage = (langCode) => {
    setLanguage(langCode);
    setLanguageSelected(true);
  };

  // Dynamic button styling for widget mode
  const buttonStyle = widgetMode && clientLogo ? {
    '--button-logo': `url(${clientLogo})`
  } : {};

  // Theme variables for widget/client mode only
  const themeStyle = widgetMode && clientTheme ? {
    '--primary-color': clientTheme.primaryColor || '#22c55e',
    '--secondary-color': clientTheme.secondaryColor || '#2563eb',
    '--primary-color-shadow': clientTheme.primaryShadow || 'rgba(34, 197, 94, 0.1)'
  } : {};

  // Light theme surface variables for VKai widget
  const lightSurfaceStyle = widgetMode && clientTheme ? {
    '--bg-main': '#f6fbfb',
    '--bg-panel': '#ffffff',
    '--avatar-bg': '#eef7f7',
    '--text-color': '#1a1a1a',
    '--muted-text': 'rgba(0,0,0,0.55)',
    '--bot-bubble-bg': '#f0f6ff',
    '--input-bg': '#ffffff',
    '--button-bg-start': clientTheme.primaryColor || '#56ccc3',
    '--button-bg-end': clientTheme.secondaryColor || '#353a96',
    '--button-border': 'rgba(0, 0, 0, 0.06)',
    '--container-border': 'rgba(0, 0, 0, 0.2)',
    '--container-border-width': '2px'
  } : {};

  return (
    <>
      {/* Floating chat button - show if not fullscreen and (not in iframe OR in widgetMode) */}
      {/* Hide floating button when widget is open (for all widgets), or when in iframe without widgetMode */}
      {!isFullPage && (!isInIframe || widgetMode) && !(widgetMode && isOpen) && (
        <>
          <div className="assistant-popup">
            {t("I'm your assistant! How can I help?", "मैं आपका सहायक हूँ! मैं कैसे मदद कर सकता हूँ?", "నేను మీ సహాయకుడిని! నేను ఎలా సహాయం చేయగలను?")}
          </div>
          <div className="chatbot-button" onClick={toggleChatbot} style={{...buttonStyle, ...lightSurfaceStyle}}>
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
            right: 'auto',
            ...themeStyle,
            ...lightSurfaceStyle
          } : { ...themeStyle, ...lightSurfaceStyle }}
        >
          {/* Header for widget mode */}
          {widgetMode ? (
            <div className="chatbot-header widget-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {clientLogo && <img src={clientLogo} alt={clientName} style={{ height: 48, width: 48, borderRadius: 10 }} />}
              <h3 style={{ margin: 0 }}>{clientName}</h3>
              <div className="header-controls" style={{ marginLeft: 'auto' }}>
                <button className="close-btn" onClick={toggleChatbot} style={{ fontSize: 28, width: 40, height: 40, color: '#e5e7eb', background: '#1f2937', borderRadius: 8, border: '1px solid #374151' }}>×</button>
              </div>
            </div>
          ) : !isFullPage && (
            <div className="chatbot-header">
              <h3>{t("Enterprise Assistant", "उद्यम सहायक", "ఎంటర్ప్రైజ్ సహాయకుడు")}</h3>
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
                setMessages={setMessages}
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
                isVoiceProcessing={isVoiceProcessing}
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
                messagesEndRef={messagesEndRef}
                widgetMode={widgetMode}
                clientName={clientName}
                clientLogo={clientLogo}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;