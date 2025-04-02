import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';
import axios from "axios";
import "./Chatbot3D.css";


const API_KEY = "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";

// HumanoidAvatar component with improved design and animations
const HumanoidAvatar = ({ isTalking, emotion }) => {
  const headRef = useRef();
  const mouthRef = useRef();
  const eyebrowsRef = useRef();



  
  // Animation loop for talking and emotions
  React.useEffect(() => {
    let animationFrameId;
    
    const animate = () => {
      if (headRef.current) {
        // Add subtle head movement when talking
        if (isTalking) {
          headRef.current.rotation.y = Math.sin(Date.now() * 0.002) * 0.08;
          
          if (mouthRef.current) {
            mouthRef.current.scale.y = 0.5 + Math.sin(Date.now() * 0.015) * 0.5;
          }
        } else {
          headRef.current.rotation.y = Math.sin(Date.now() * 0.0008) * 0.03;
          
          if (mouthRef.current) {
            mouthRef.current.scale.y = 1;
          }
        }
        
        // Apply emotional expressions
        if (eyebrowsRef.current) {
          switch (emotion) {
            case "happy":
              eyebrowsRef.current.rotation.x = -0.2;
              break;
            case "sad":
              eyebrowsRef.current.rotation.x = 0.3;
              break;
            case "angry":
              eyebrowsRef.current.rotation.x = 0.3;
              eyebrowsRef.current.rotation.z = 0.2;
              break;
            case "surprised":
              eyebrowsRef.current.position.y = 0.22;
              break;
            default: // neutral
              eyebrowsRef.current.rotation.x = 0;
              eyebrowsRef.current.rotation.z = 0;
              eyebrowsRef.current.position.y = 0.2;
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isTalking, emotion]);
  
  // Enhanced humanoid design with better proportions and colors
  return (
    <group>
      {/* Head */}
      <group ref={headRef}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#e8c4a0" metalness={0.2} roughness={0.8} />
        </mesh>
        
        {/* Hair */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.52, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#3a2618" metalness={0.1} roughness={0.9} />
        </mesh>
        
        {/* Eyes */}
        <group>
          {/* Left eye */}
          <mesh position={[-0.15, 0.1, 0.4]}>
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[-0.15, 0.1, 0.48]}>
            <sphereGeometry args={[0.04, 32, 32]} />
            <meshStandardMaterial color="#2b5797" />
          </mesh>
          
          {/* Right eye */}
          <mesh position={[0.15, 0.1, 0.4]}>
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0.15, 0.1, 0.48]}>
            <sphereGeometry args={[0.04, 32, 32]} />
            <meshStandardMaterial color="#2b5797" />
          </mesh>
        </group>
        
        {/* Eyebrows */}
        <group ref={eyebrowsRef} position={[0, 0.2, 0]}>
          <mesh position={[-0.15, 0, 0.45]} rotation={[0, 0, Math.PI * 0.1]}>
            <boxGeometry args={[0.12, 0.02, 0.02]} />
            <meshStandardMaterial color="#3a2618" />
          </mesh>
          <mesh position={[0.15, 0, 0.45]} rotation={[0, 0, -Math.PI * 0.1]}>
            <boxGeometry args={[0.12, 0.02, 0.02]} />
            <meshStandardMaterial color="#3a2618" />
          </mesh>
        </group>
        
        {/* Nose */}
        <mesh position={[0, 0, 0.45]}>
          <coneGeometry args={[0.05, 0.1, 32]} />
          <meshStandardMaterial color="#e0b088" metalness={0.1} roughness={0.7} />
        </mesh>
        
        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, -0.15, 0.4]}>
          <boxGeometry args={[0.2, 0.03, 0.01]} />
          <meshStandardMaterial color="#a83232" />
        </mesh>
        
        {/* Neck */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.3, 32]} />
          <meshStandardMaterial color="#e8c4a0" metalness={0.2} roughness={0.8} />
        </mesh>
      </group>
      
      {/* Body (professional looking) */}
      <group position={[0, -0.8, 0]}>
        {/* Shirt/Suit */}
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.7, 0.8, 0.3]} />
          <meshStandardMaterial color="#2b5797" metalness={0.3} roughness={0.7} />
        </mesh>
        
        {/* Collar */}
        <mesh position={[0, -0.05, 0.15]}>
          <boxGeometry args={[0.4, 0.1, 0.05]} />
          <meshStandardMaterial color="white" />
        </mesh>
        
        {/* Arms */}
        <mesh position={[-0.45, -0.3, 0]} rotation={[0, 0, -Math.PI * 0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 32]} />
          <meshStandardMaterial color="#2b5797" metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh position={[0.45, -0.3, 0]} rotation={[0, 0, Math.PI * 0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 32]} />
          <meshStandardMaterial color="#2b5797" metalness={0.3} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};

// Language picker component
const LanguagePicker = ({ selectedLanguage, onSelectLanguage }) => {
  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी (Hindi)" }
  ];
  
  
  return (
    <div className="language-picker">
      <p>{selectedLanguage === "en" ? "Select Language:" : "भाषा चुनें:"}</p>
      <div className="language-buttons">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={selectedLanguage === lang.code ? "active" : ""}
            onClick={() => onSelectLanguage(lang.code)}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

// Expanded chatbot component with language support
const Chatbot = ({ isFullPage = false }) => {
  const [language, setLanguage] = useState("en");
  const [languageSelected, setLanguageSelected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const [isTalking, setIsTalking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [emotion, setEmotion] = useState("neutral");
  // Initialize isOpen based on isFullPage prop
  const [isOpen, setIsOpen] = useState(isFullPage);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isFullPage && !isOpen) {
      setIsOpen(true);
    }
  }, [isFullPage, isOpen]);

  const toggleChatbot = () => {
    if (!isFullPage) {
      setIsOpen(!isOpen);
    }
  };

  // Initialize welcome message based on selected language
  useEffect(() => {
    if (languageSelected) {
      const welcomeMessage = language === "en" 
        ? "Hello! I'm your virtual assistant. How can I help you today?" 
        : "नमस्ते! मैं आपका वर्चुअल असिस्टेंट हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?";
      
      setMessages([{ text: welcomeMessage, fromBot: true }]);
    }
  }, [languageSelected, language]);
  useEffect(() => {
    const messagesContainer = document.querySelector('.messages');
    
    if (messagesContainer && isOpen) {
      // Initially scroll to the bottom when chat opens
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Fix for touch devices - add if needed
      messagesContainer.style.overflowY = "auto";
      messagesContainer.style.WebkitOverflowScrolling = "touch";
    }
  }, [isOpen]);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  

  /*const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };*/

  const selectLanguage = (langCode) => {
    setLanguage(langCode);
    setLanguageSelected(true);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const speak = (text) => {
    if (!isMuted && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "en" ? "en-US" : "hi-IN";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const detectEmotion = (text) => {
    // For English
    if (language === "en") {
      const lowerText = text.toLowerCase();
      if (lowerText.includes("happy") || lowerText.includes("great") || lowerText.includes("good")) return "happy";
      if (lowerText.includes("sad") || lowerText.includes("bad") || lowerText.includes("unhappy")) return "sad";
      if (lowerText.includes("angry") || lowerText.includes("mad") || lowerText.includes("furious")) return "angry";
      if (lowerText.includes("surprised") || lowerText.includes("wow") || lowerText.includes("amazing")) return "surprised";
    } 
    // For Hindi
    else {
      const lowerText = text.toLowerCase();
      if (lowerText.includes("खुश") || lowerText.includes("अच्छा") || lowerText.includes("बढ़िया")) return "happy";
      if (lowerText.includes("दुखी") || lowerText.includes("बुरा") || lowerText.includes("उदास")) return "sad";
      if (lowerText.includes("गुस्सा") || lowerText.includes("नाराज") || lowerText.includes("क्रोधित")) return "angry";
      if (lowerText.includes("आश्चर्य") || lowerText.includes("वाह") || lowerText.includes("अद्भुत")) return "surprised";
    }
    return "neutral";
  };

  const handleSend = async (messageToSend = input) => {
    if (!messageToSend.trim()) return;

    // Add user message to the chat
    setMessages((prevMessages) => [...prevMessages, { text: messageToSend, fromBot: false }]);
    setInput("");
    setIsTalking(false);
    setIsTyping(true);

    try {
      // Prepare system prompt based on selected language
      const systemPrompt = language === "en"
        ? "You are a professional, helpful assistant for a large technology company. Respond in English."
        : "आप एक बड़ी प्रौद्योगिकी कंपनी के लिए एक पेशेवर, सहायक सहायक हैं। हिंदी में जवाब दें।";

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map(msg => ({
              role: msg.fromBot ? "assistant" : "user",
              content: msg.text
            })),
            { role: "user", content: messageToSend },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
          },
        }
      );

      if (!response.data || !response.data.choices || response.data.choices.length === 0) {
        throw new Error("Invalid API response format");
      }

      const botMessage = response.data.choices[0].message?.content || 
        (language === "en" ? "I'm not sure how to respond." : "मुझे जवाब देना नहीं आता।");
      
      const detectedEmotion = detectEmotion(botMessage);
      setEmotion(detectedEmotion);
      
      setIsTyping(false);
      setIsTalking(true);
      speak(botMessage);

      setMessages((prevMessages) => [...prevMessages, { text: "", fromBot: true }]);

      let displayedText = "";
      let i = 0;
      const interval = setInterval(() => {
        if (i < botMessage.length) {
          displayedText += botMessage[i];
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = { text: displayedText, fromBot: true };
            return newMessages;
          });
          i++;
          
          // Scroll to bottom after each character to follow the text generation
          scrollToBottom();
        } else {
          clearInterval(interval);
          setIsTalking(false);
        }
      }, 30); // Slightly faster typing for better UX
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      const errorMessage = language === "en"
        ? "Sorry, I couldn't process that request. Please try again."
        : "क्षमा करें, मैं आपके अनुरोध को संसाधित नहीं कर सका। कृपया पुनः प्रयास करें।";
      
      setMessages((prevMessages) => [...prevMessages, { text: errorMessage, fromBot: true }]);
      setIsTyping(false);
      setIsTalking(false);
    }
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert(language === "en" 
        ? "Your browser does not support voice recognition." 
        : "आपका ब्राउज़र वॉयस रिकग्निशन का समर्थन नहीं करता है।");
      return;
    }
  
    setIsListening(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language === "en" ? "en-US" : "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      setInput(transcript);
      handleSend(transcript);
    };
  
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
  
    recognition.onend = () => {
      setIsListening(false);
    };
  
    recognition.start();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Localized UI text based on selected language
  const uiText = {
    chatbotTitle: language === "en" ? "Enterprise Assistant" : "उद्यम सहायक",
    placeholder: language === "en" ? "Type your message..." : "अपना संदेश टाइप करें...",
    chooseLanguage: language === "en" ? "Choose Language" : "भाषा चुनें",
    typingIndicator: language === "en" ? "Typing..." : "टाइप कर रहा है...",
  };

  return (
    <>
      {/* Floating chat button */}
      {!isFullPage && (
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
        {/* Header with modified controls */}
        <div className="chatbot-header">
          <h3>{uiText.chatbotTitle}</h3>
          <div className="header-controls">
            <button className="voice-button" onClick={startListening} disabled={isListening || !languageSelected}>
              {isListening ? "🎤" : "🎤"}
            </button>
            <button className="mute-button" onClick={toggleMute}>
              {isMuted ? "🔇" : "🔊"}
            </button>
              <button className="close-btn" onClick={toggleChatbot}>×</button>
            </div>
          </div>

          {/* Language selection or avatar based on the state lem */}
          {!languageSelected ? (
            <div className="language-selection-container">
              <LanguagePicker selectedLanguage={language} onSelectLanguage={selectLanguage} />
            </div>
          
          ) : (
            <>
              {/* 3D Avatar container */}
              <div className="avatar-container">
                <Canvas
                  gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
                  camera={{
                    position: [0, 0, 2.2],
                    fov: 45,
                    near: 0.1,
                    far: 1000
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Suspense fallback={null}>
                    {/* Lighting Setup */}
                    <Environment preset="studio" />
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
                    
                    {/* Humanoid Avatar */}
                    <HumanoidAvatar isTalking={isTalking} emotion={emotion} />
                    
                    {/* Camera Controls - Limited to prevent awkward angles */}
                    <OrbitControls 
                      enableZoom={false}
                      minPolarAngle={Math.PI/2 - 0.4}
                      maxPolarAngle={Math.PI/2 + 0.4}
                      minAzimuthAngle={-Math.PI/4}
                      maxAzimuthAngle={Math.PI/4}
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

              {/* Chat interface */}
              <div className="chat-interface">
                <div className="messages">
                  {messages.map((msg, index) => (
                    <div key={index} className={msg.fromBot ? "bot-msg" : "user-msg"}>
                      <div className="message-bubble">
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="bot-msg">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                  {/*lem */}
              
                  <div ref={messagesEndRef} />
                </div>
              
                
                {/* Input area */}
                <div className="input-area">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={uiText.placeholder}
                    disabled={isTyping}
                  />
                  <button 
                    onClick={() => handleSend()} 
                    disabled={!input.trim() || isTyping}
                    className={!input.trim() || isTyping ? "disabled-btn" : ""}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;