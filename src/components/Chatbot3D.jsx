import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';
import axios from "axios";
import "./Chatbot3D.css";
import Avatar from "./Avatar";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';




const HumanoidAvatar = ({ isTalking, emotion }) => {
  const headRef = useRef();
  const mouthRef = useRef();
  const eyebrowsRef = useRef();



  
  React.useEffect(() => {
    let animationFrameId;
    
    const animate = () => {
      if (headRef.current) {
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
      <p>{selectedLanguage === "en" ? "" : "भाषा चुनें:"}</p>
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
  const [isOpen, setIsOpen] = useState(isFullPage);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCarInput, setShowCarInput] = useState(false);
  const [carInput, setCarInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const fileInputRef = useRef(null);
  const [damageImageUrl, setDamageImageUrl] = useState(null);
  const [partsImageUrl, setPartsImageUrl] = useState(null);

  useEffect(() => {
    if (isFullPage) {
      setIsOpen(true);
    }
  }, [isFullPage]);
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
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      messagesContainer.style.overflowY = "auto";
      messagesContainer.style.WebkitOverflowScrolling = "touch";
    }
  }, [isOpen]);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    const messagesContainer = document.querySelector('.messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };  
  useEffect(() => {
    if (isFullPage && messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isFullPage, messages]);
  



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

  const isClaimRelatedQuery = (text) => {
    const claimKeywords = [
      'claim', 'accident', 'damage', 'car damage', 'vehicle damage',
      'insurance claim', 'file claim', 'raise claim', 'report damage'
    ];
    const lowerText = text.toLowerCase();
    return claimKeywords.some(keyword => lowerText.includes(keyword));
  };

  const handleCarDetails = async () => {
    if (!carInput.includes(',')) {
      const errorMessage = language === "en"
        ? "Please provide car make and model separated by comma (e.g., Maruti,Swift)"
        : "कृपया कार का मेक और मॉडल कॉमा से अलग करके दें (जैसे, Maruti,Swift)";
      
      // Reset states first
      setUploadStatus("idle");
      setShowCarInput(true); // Keep the car input visible
      
      // Show error message with avatar movement
      setIsTyping(true);
      setIsTalking(false);
      
      setTimeout(() => {
        setIsTyping(false);
        setIsTalking(true);
        speak(errorMessage);
        
        setMessages(prev => [...prev, { text: errorMessage, fromBot: true }]);
        scrollToBottom();
        setTimeout(() => setIsTalking(false), 500);
      }, 500);
      return;
    }

    const [carMake, carModel] = carInput.split(',').map(item => item.trim());
    
    if (!carMake || !carModel) {
      const errorMessage = language === "en"
        ? "Please provide both car make and model"
        : "कृपया कार का मेक और मॉडल दोनों प्रदान करें";
      
      setIsTyping(true);
      setIsTalking(false);
      
      setTimeout(() => {
        setIsTyping(false);
        setIsTalking(true);
        speak(errorMessage);
        
        setMessages(prev => [...prev, { text: errorMessage, fromBot: true }]);
        scrollToBottom();
        setTimeout(() => setIsTalking(false), 500);
      }, 500);
      return;
    }

    // Hide both car input and image container immediately when submit is clicked
    setShowCarInput(false);
    setShowImageUpload(false);

    setUploadStatus("uploading");
    const processingMessage = language === "en"
      ? "I'm analyzing your vehicle damage. This will take just a moment..."
      : "मैं आपके वाहन की क्षति का विश्लेषण कर रहा हूं। इसमें कुछ समय लगेगा...";
    
    setIsTyping(true);
    setIsTalking(false);
    
    setTimeout(() => {
      setIsTyping(false);
      setIsTalking(true);
      speak(processingMessage);
      
      setMessages(prev => [...prev, { text: processingMessage, fromBot: true }]);
      scrollToBottom();
      setTimeout(() => setIsTalking(false), 500);
    }, 500);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("carMake", carMake);
    formData.append("carModel", carModel);

    try {
      const response = await axios.post("https://aadybackend.site/api/upload", formData);
      
      if (response.status === 200 && response.data) {
        const damageStatus = response.data.model1_output?.[0]?.label || "Unknown";
        const damagedParts = response.data.parts || [];
        const costEstimates = response.data.cost || [];
        
        // Get damage and parts images from response
        const damageImage = response.data.model1_output?.[0]?.output_image_base64;
        const partsImage = response.data.model2_output?.[0]?.output2_image_base64;

        // Reset states before showing the result
        setUploadStatus("idle");
        setSelectedFile(null);
        setCarInput("");

        // Show the images first
        if (damageImage) {
          const damageImageUrl = damageImage.startsWith('data') ? damageImage : `data:image/png;base64,${damageImage}`;
          setMessages(prev => [...prev, { 
            text: "Damage Detection Image:", 
            fromBot: true,
            image: damageImageUrl 
          }]);
        }
        if (partsImage) {
          const partsImageUrl = partsImage.startsWith('data') ? partsImage : `data:image/png;base64,${partsImage}`;
          setMessages(prev => [...prev, { 
            text: "Parts Detection Image:", 
            fromBot: true,
            image: partsImageUrl 
          }]);
        }
        
        // Create a detailed message with each part and its price range
        let detailedMessage = language === "en" 
          ? `Based on my analysis:\n\n Damage Status: ${damageStatus}\n\n`
          : `मेरे विश्लेषण के अनुसार:\n\n🔍 क्षति स्थिति: ${damageStatus}\n\n`;

        // Add each damaged part with its price range
        damagedParts.forEach((part, index) => {
          const formattedPart = part.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          const priceRange = costEstimates[index] || "Price not available";
          
          detailedMessage += language === "en"
            ? `• ${formattedPart}: ₹${priceRange}\n`
            : `• ${formattedPart}: ₹${priceRange}\n`;
        });

        // Add final question
        detailedMessage += language === "en"
          ? "\nWould you like to know anything else about your claim?"
          : "\nक्या आप अपने दावे के बारे में कुछ और जानना चाहेंगे?";

        // Show the analysis text after images
        setIsTyping(false);
        setIsTalking(true);
        speak(detailedMessage);
        setMessages(prev => [...prev, { text: detailedMessage, fromBot: true }]);
        
        scrollToBottom();
        setTimeout(() => setIsTalking(false), 500);

      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      // Handle error with conversational message and avatar movement
      const errorMessage = language === "en"
        ? "I'm having trouble analyzing your claim at the moment. This sometimes happens, but don't worry! Could you try uploading the image again?"
        : "मुझे इस समय आपके दावे का विश्लेषण करने में परेशानी हो रही है। ऐसा कभी-कभी होता है, लेकिन चिंता न करें! क्या आप छवि को फिर से अपलोड करने का प्रयास कर सकते हैं?";

      // Reset states but keep upload UI visible for retry
      setUploadStatus("idle");
      setSelectedFile(null);
      setCarInput("");

      // Show error message with avatar movement
      setIsTyping(false);
      setIsTalking(true);
      speak(errorMessage);
      setMessages(prev => [...prev, { text: errorMessage, fromBot: true }]);
      scrollToBottom();
      setTimeout(() => setIsTalking(false), 500);
    }
  };

  const handleSend = async (messageToSend = input) => {
    if (!messageToSend.trim()) return;

    // Hide upload UI when new message is sent
    setShowImageUpload(false);
    setShowCarInput(false);
    setSelectedFile(null);
    setCarInput("");

    setMessages((prevMessages) => [...prevMessages, { text: messageToSend, fromBot: false }]);
    setInput("");

    // Check if the message is claim-related
    if (isClaimRelatedQuery(messageToSend)) {
      const uploadMessage = language === "en"
        ? "I understand you want to file a claim for your vehicle. I'll help you with that. Please upload a clear photo of the damage using one of the buttons below."
        : "मैं समझता हूं कि आप अपने वाहन के लिए दावा दर्ज करना चाहते हैं। मैं आपकी मदद करूंगा। कृपया नीचे दिए गए बटनों में से किसी एक का उपयोग करके क्षति की एक स्पष्ट तस्वीर अपलोड करें।";
      
      setIsTyping(true);
      setIsTalking(false);

      // Add delay to simulate typing
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsTyping(false);
      setIsTalking(true);
      speak(uploadMessage);

      // Animate the text appearance
      let displayedText = "";
      let i = 0;
      setMessages(prev => [...prev, { text: "", fromBot: true }]);

      const interval = setInterval(() => {
        if (i < uploadMessage.length) {
          displayedText += uploadMessage[i];
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = { text: displayedText, fromBot: true };
            return newMessages;
          });
          i++;
          scrollToBottom();
        } else {
          clearInterval(interval);
          setIsTalking(false);
          setShowImageUpload(true);
        }
      }, 30);
      return;
    }

    // If not claim-related, proceed with the existing chat flow
    setIsTalking(false);
    setIsTyping(true);

    try {
      const systemPrompt = language === "en"
        ? "You are a professional, helpful assistant for a large technology company. Respond in English."
        : "आप एक बड़ी प्रौद्योगिकी कंपनी के लिए एक पेशेवर, सहायक सहायक हैं। हिंदी में जवाब दें।";

      const response = await axios.post(
        "https://aadybackend.site/api/chat",  
        {
          systemPrompt: systemPrompt,
          messages: messages, 
          messageToSend: messageToSend
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      let botMessage;

      if (response.data && response.data.response) {
        const responseString = response.data.response;
        
        const contentStart = responseString.indexOf("content=") + 8; // 8 is the length of "content="
        const refusalStart = responseString.indexOf(", refusal=");
        
        if (contentStart !== -1 && refusalStart !== -1) {
          botMessage = responseString.substring(contentStart, refusalStart);

        } else {
          botMessage = language === "en" ? "I'm not sure how to respond." : "मुझे जवाब देना नहीं आता।";
        }
      } else {
        botMessage = language === "en" ? "I'm not sure how to respond." : "मुझे जवाब देना नहीं आता।";
      }

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
          
          scrollToBottom();
        } else {
          clearInterval(interval);
          setIsTalking(false);
        }
      }, 30); 
    } catch (error) {
      const errorMessage = language === "en"
        ? "Sorry, I couldn't process that request. Please try again."
        : "क्षमा करें, मैं आपके अनुरोध को संसाधित नहीं कर सका। कृपया पुनः प्रयास करें।";
      
      setMessages((prevMessages) => [...prevMessages, { text: errorMessage, fromBot: true }]);
      setIsTyping(false);
      setIsTalking(false);
    }
  };

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (listening) {
    }
  }, [transcript, listening]);
  useEffect(() => {
    if (listening && transcript) {
      setInput(transcript);
    }
  }, [transcript, listening]);
  useEffect(() => {
    const handleError = (event) => {
      setIsListening(false);
      console.log("SpeechRecognition Error:", event.error);

      alert(language === "en"
        ? "Speech recognition error. Please try again."
        : "स्पीच रिकग्निशन त्रुटि। कृपया पुनः प्रयास करें।");
    };

    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.getRecognition()?.addEventListener('error', handleError);
      
      return () => {
        SpeechRecognition.getRecognition()?.removeEventListener('error', handleError);
      };
    }
  }, [language, browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (!listening && isListening) {
      setIsListening(false);
      
      if (transcript && transcript.trim()) {
        handleSend(transcript);
        resetTranscript();
      }
    }
  }, [listening, isListening]);

  useEffect(() => {
    let timeoutId;
    
    if (isListening) {
      timeoutId = setTimeout(() => {
        stopListening();
      }, 15000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isListening]);
  useEffect(() => {
    
    if (!listening && isListening) {
      setIsListening(false);
      
      if (transcript && transcript.trim()) {
        handleSend(transcript);
        resetTranscript();
      }
    }
  }, [listening, isListening, transcript, handleSend, resetTranscript]);

  const startListening = () => {
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
          interimResults: true,  // Add this to get partial results
          language: language === "en" ? "en-US" : "hi-IN" 
        });
      })
      .catch(error => {
        alert(language === "en" 
          ? "Microphone access is required for voice input." 
          : "वॉइस इनपुट के लिए माइक्रोफोन एक्सेस आवश्यक है।");
      });
  };

  const stopListening = () => {
    
    const finalTranscript = transcript;
    
    setIsListening(false);
    

    SpeechRecognition.stopListening();
    
    if (finalTranscript && finalTranscript.trim()) {
      setInput(finalTranscript);
      
      setTimeout(() => {
        handleSend(finalTranscript);
        resetTranscript();
      }, 300); 
    } else {
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
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

  const handleImageSelect = (file) => {
    setSelectedFile(file);
    const carDetailsMessage = language === "en"
      ? "Please provide your car's make and model separated by a comma. For example: Maruti,Swift"
      : "कृपया अपनी कार का मेक और मॉडल कॉमा से अलग करके प्रदान करें। उदाहरण के लिए: Maruti,Swift";

    setIsTyping(true);
    setIsTalking(false);

    setTimeout(() => {
      setIsTyping(false);
      setIsTalking(true);
      speak(carDetailsMessage);

      let displayedText = "";
      let i = 0;
      setMessages(prev => [...prev, { text: "", fromBot: true }]);

      const interval = setInterval(() => {
        if (i < carDetailsMessage.length) {
          displayedText += carDetailsMessage[i];
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = { text: displayedText, fromBot: true };
            return newMessages;
          });
          i++;
          scrollToBottom();
        } else {
          clearInterval(interval);
          setIsTalking(false);
          setShowCarInput(true);
        }
      }, 30);
    }, 500);
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

        {!isFullPage && (
      <div className="chatbot-header">
        <h3>{uiText.chatbotTitle}</h3>
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
                    position: isFullPage ? [0, 0.5, 2.5] : [0, 1.6, 1.0], // Adjusted for full-page
                    fov: isFullPage ? 35 : 25, // Wider field of view for full-page
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
                    
                    <Avatar isTalking={isTalking} emotion={emotion} isFullPage={isFullPage} />
                    
                    <OrbitControls 
  enableZoom={isFullPage}
  minPolarAngle={Math.PI/2 - (isFullPage ? 0.4 : 0.2)} // Less restricted in full-page
  maxPolarAngle={Math.PI/2 + (isFullPage ? 0.4 : 0.2)} // Less restricted in full-page
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

              {/* Chat interface */}
              <div className="chat-interface">
                <div className="messages">
                  {messages.map((msg, index) => (
                    <div key={index} className={msg.fromBot ? "bot-msg" : "user-msg"}>
                      <div className="message-bubble">
                        {msg.text}
                        {msg.image && (
                          <div className="mt-2">
                            <img 
                              src={msg.image} 
                              alt="Analysis" 
                              className="max-w-full rounded-lg border border-gray-700"
                              style={{ maxHeight: '200px', objectFit: 'contain' }}
                            />
                          </div>
                        )}
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
              
                {/* Add this block for image upload UI */}
                {showImageUpload && (
                  <div className="upload-container p-2 bg-gray-800/20 rounded-lg mb-2">
                    <div className="flex flex-col gap-2">
                      {!selectedFile ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              if (fileInputRef.current) {
                                fileInputRef.current.removeAttribute('capture');
                                fileInputRef.current.click();
                              }
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 text-gray-200 rounded-md hover:bg-gray-600/50 transition-colors text-sm border border-gray-600/30"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {language === "en" ? "Gallery" : "गैलरी"}
                          </button>
                          <button
                            onClick={() => {
                              if (fileInputRef.current) {
                                fileInputRef.current.setAttribute('capture', 'environment');
                                fileInputRef.current.click();
                              }
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 text-gray-200 rounded-md hover:bg-gray-600/50 transition-colors text-sm border border-gray-600/30"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {language === "en" ? "Camera" : "कैमरा"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative inline-block" style={{ width: '60px', height: '40px', overflow: 'hidden' }}>
                            <img 
                              src={URL.createObjectURL(selectedFile)} 
                              alt="Selected" 
                              className="w-full h-full object-cover rounded-md"
                              style={{ objectFit: 'cover' }}
                            />
                            <button
                              onClick={() => {
                                setSelectedFile(null);
                                setShowCarInput(false);
                              }}
                              className="absolute -top-1 -right-1 p-1 bg-gray-800/70 text-gray-200 rounded-full hover:bg-gray-700/70"
                              style={{ transform: 'scale(0.8)' }}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                              const errorMessage = language === "en"
                                ? "Image size should be less than 5MB"
                                : "छवि का आकार 5MB से कम होना चाहिए";
                              alert(errorMessage);
                              return;
                            }
                            setSelectedFile(file);
                            handleImageSelect(file);
                          }
                        }}
                      />

                      {showCarInput && (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={carInput}
                            onChange={(e) => setCarInput(e.target.value)}
                            placeholder={language === "en" ? "Car Make,Car Model (e.g., Maruti,Swift)" : "कार मेक,कार मॉडल (जैसे, Maruti,Swift)"}
                            className="w-full px-3 py-2 bg-gray-700/30 text-gray-200 text-sm rounded-md border border-gray-600/30 focus:outline-none focus:border-gray-500/50"
                          />
                          <button
                            onClick={handleCarDetails}
                            disabled={!carInput.includes(',') || uploadStatus === "uploading"}
                            className={`w-full px-3 py-2 rounded-md transition-colors text-sm ${
                              !carInput.includes(',') || uploadStatus === "uploading"
                                ? "bg-gray-600/30 text-gray-400 cursor-not-allowed"
                                : "bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 border border-gray-600/30"
                            }`}
                          >
                            {uploadStatus === "uploading"
                              ? (language === "en" ? "Processing..." : "प्रसंस्करण...")
                              : (language === "en" ? "Submit" : "जमा करें")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Input area */}
                <div className="input-area">
  {isListening ? (
    // Recording UI
    <div className="recording-container">
  <div className="recording-wave">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
  <div className="recording-text">
    {language === "en" ? "Listening..." : "सुन रहा हूँ..."}
  </div>
  <button onClick={stopListening} className="stop-recording-btn">
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
      <circle cx="12" cy="12" r="10" />
      <rect x="9" y="9" width="6" height="6" />
    </svg>
  </button>
</div>
  ) : (
    // Normal input UI
    <>
      <button className="mute-button input-control-btn" onClick={toggleMute}>
        {isMuted ? "🔇" : "🔊"}
      </button>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={uiText.placeholder}
        disabled={isTyping}
      />
      {!input.trim() ? (
        <button 
        onClick={() => {
          if (isListening) {
            stopListening();
          } else {
            startListening();
          }
        }} 
        disabled={!languageSelected || isTyping}
        className={`voice-button input-control-btn ${isListening ? 'active' : ''}`}
        title={language === "en" ? "Voice input" : "वॉइस इनपुट"}
      >
        {isListening ? (
    // Microphone active icon
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="22"></line>
      <line x1="8" y1="22" x2="16" y2="22"></line>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="22"></line>
    <line x1="8" y1="22" x2="16" y2="22"></line>
  </svg>
)}
</button>
      ) : (
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
      )}
    </>
  )}
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