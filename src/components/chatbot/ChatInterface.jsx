import React, { useEffect } from 'react';
import { getLanguageLocale } from '../../utils/languageUtils';

const ChatInterface = ({
  messages,
  setMessages,
  input,
  setInput,
  handleSend,
  handleKeyPress,
  isTyping,
  isListening,
  startListening,
  stopListening,
  isMuted,
  toggleMute,
  language,
  isVoiceProcessing,
  showImageUpload,
  selectedFile,
  setSelectedFile,
  fileInputRef,
  handleImageSelect,
  showCarInput,
  carInput,
  setCarInput,
  handleCarDetails,
  uploadStatus,
  setShowCarInput,
  setShowImageUpload,
  messagesEndRef,
  widgetMode = false,
  clientName = '',
  clientLogo = ''
}) => {
  const isTripMall = widgetMode && (clientName || '').toLowerCase().includes('tripmall');

  const t = (englishText, hindiText, teluguText = englishText) => {
    if (language === "hi") return hindiText;
    if (language === "te") return teluguText;
    return englishText;
  };

  const uiText = {
    chatbotTitle: t("Enterprise Assistant", "उद्यम सहायक", "ఎంటర్ప్రైజ్ సహాయకుడు"),
    placeholder: t("Type your message...", "अपना संदेश टाइप करें...", "మీ సందేశాన్ని టైప్ చేయండి..."),
    chooseLanguage: t("Choose Language", "भाषा चुनें", "భాషను ఎంచుకోండి"),
    typingIndicator: t("Typing...", "टाइप कर रहा है...", "టైప్ అవుతోంది..."),
  };

  // Voice mapping for TripMall dropdowns
  const voiceMapping = {
    // Scope options
    'india': 'india',
    'international': 'international',
    'indian': 'india',
    'domestic': 'india',
    'abroad': 'international',
    'overseas': 'international',
    
    // India destinations
    'assam': 'assam-meghalaya',
    'meghalaya': 'assam-meghalaya',
    'assam and meghalaya': 'assam-meghalaya',
    'himachal': 'himachal',
    'himachal pradesh': 'himachal',
    'jammu': 'jammu-kashmir',
    'kashmir': 'jammu-kashmir',
    'jammu and kashmir': 'jammu-kashmir',
    'ladakh': 'leh-ladakh',
    'leh': 'leh-ladakh',
    'leh ladakh': 'leh-ladakh',
    'uttarakhand': 'uttarakhand',
    'uttar pradesh': 'uttarpradesh',
    'sikkim': 'sikkim-darjeeling',
    'darjeeling': 'sikkim-darjeeling',
    'sikkim and darjeeling': 'sikkim-darjeeling',
    'madhya pradesh': 'madhya-pradesh',
    'odisha': 'odisha',
    'orissa': 'odisha',
    'karnataka': 'karnataka',
    'kerala': 'kerala',
    'tamil nadu': 'tamil-nadu',
    'andaman': 'andaman',
    'rajasthan': 'rajasthan',
    
    // International destinations
    'bali': 'bali',
    'thailand': 'thailand',
    'dubai': 'dubai',
    'singapore': 'singapore',
    
    // Duration options
    '5 days': '5',
    'five days': '5',
    '6 days': '6',
    'six days': '6',
    '7 days': '7',
    'seven days': '7',
    '8 days': '8-9',
    'eight days': '8-9',
    '9 days': '8-9',
    'nine days': '8-9',
    '8 and 9 days': '8-9',
    '8 & 9 days': '8-9'
  };

  // TTS service for user messages - DISABLED for TripMall
  const speakUserMessage = async (text) => {
    // TripMall doesn't speak user messages back
    return;
  };

  // TTS service for bot messages with background pre-loading
  const preloadTTS = async (text) => {
    if (isTripMall && !isMuted) {
      try {
        const formData = new FormData();
        formData.append('text', text);
        formData.append('language', getLanguageLocale(language));
        console.log('[TTS] Sending preload request to /speech/tts', {
          url: 'https://uat-api.miraista.com/api/speech/tts',
          payload: {
            text,
            language: getLanguageLocale(language)
          }
        });
        const response = await fetch('https://uat-api.miraista.com/api/speech/tts', {
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          return audioUrl;
        }
      } catch (err) {
        console.error('TTS error:', err);
      }
    }
    return null;
  };

  const speakBotMessage = async (audioUrl) => {
    if (audioUrl) {
      const audio = new window.Audio(audioUrl);
      return new Promise((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.play();
      });
    }
  };

  // Render message text with clickable links
  const renderTextWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return (
      <>
        {parts.map((part, idx) => (
          urlRegex.test(part) ? (
            <a key={idx} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>{part}</a>
          ) : (
            <span key={idx}>{part}</span>
          )
        ))}
      </>
    );
  };

  // TripMall guided flow state (kept ephemeral in component)
  const [tripScope, setTripScope] = React.useState(""); // 'india' | 'international'
  const [tripDestination, setTripDestination] = React.useState("");
  const [tripDuration, setTripDuration] = React.useState("");

  const INDIA_OPTIONS = [
    { value: 'assam-meghalaya', label: 'Assam & Meghalaya' },
    { value: 'himachal', label: 'Himachal' },
    { value: 'jammu-kashmir', label: 'Jammu & Kashmir' },
    { value: 'leh-ladakh', label: 'Leh Ladakh' },
    { value: 'uttarakhand', label: 'Uttarakhand' },
    { value: 'uttarpradesh', label: 'Uttarpradesh' },
    { value: 'sikkim-darjeeling', label: 'Sikkim Darjeeling' },
    { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
    { value: 'odisha', label: 'Odisha' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'andaman', label: 'Andaman' },
    { value: 'rajasthan', label: 'Rajasthan' }
  ];

  const INTL_OPTIONS = [
    { value: 'bali', label: 'Bali' },
    { value: 'thailand', label: 'Thailand' },
    { value: 'dubai', label: 'Dubai' },
    { value: 'singapore', label: 'Singapore' }
  ];

  const DURATION_OPTIONS = [
    { value: '5', label: '5 Days' },
    { value: '6', label: '6 Days' },
    { value: '7', label: '7 Days' },
    { value: '8-9', label: '8 & 9 Days' }
  ];

  const getBookingUrl = () => {
    if (tripScope !== 'india') return 'https://www.tripmall.in/'; // placeholder for international
    if (tripDestination === 'assam-meghalaya') {
      return 'https://www.tripmall.in/tour/6-days-assam-tour-kaziranga-shillong-guwahati';
    }
    if (tripDestination === 'himachal') {
      return 'https://www.tripmall.in/tour/7-days-himachal-tour-shimla-manali-chandigarh';
    }
    return 'https://www.tripmall.in/';
  };

  const pushBot = (text) => setMessages(prev => ([...prev, { text, fromBot: true }]));
  const pushUser = (text, fromDropdown = false) => setMessages(prev => ([...prev, { text, fromBot: false, fromDropdown }]));

  // Stream bot message with typing effect and TTS for TripMall
  const streamBotMessage = async (text) => {
    if (!isTripMall) {
      pushBot(text);
      return;
    }

    // Pre-load TTS in background
    const audioUrl = await preloadTTS(text);

    // Add empty message for streaming
    setMessages(prev => [...prev, { text: "", fromBot: true }]);
    let displayedText = "";
    let i = 0;
    let ttsStarted = false;

    // Clear any existing interval
    if (window.tripMallStreamInterval) {
      clearInterval(window.tripMallStreamInterval);
      window.tripMallStreamInterval = null;
    }

    // Create streaming interval
    window.tripMallStreamInterval = setInterval(() => {
      if (i < text.length) {
        displayedText += text[i];
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = { text: displayedText, fromBot: true };
          return newMessages;
        });
        
        // Start TTS after typing a few characters (realistic timing)
        if (!ttsStarted && i > 3 && audioUrl) {
          ttsStarted = true;
          speakBotMessage(audioUrl);
        }
        
        i++;
      } else {
        // Streaming complete
        clearInterval(window.tripMallStreamInterval);
        window.tripMallStreamInterval = null;
        
        // Final update to ensure complete message is displayed
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = { text: text, fromBot: true };
          return newMessages;
        });

        // If TTS hasn't started yet, start it now
        if (!ttsStarted && audioUrl) {
          speakBotMessage(audioUrl);
        }
      }
    }, 30);
  };

  const resetTrip = () => {
    setTripScope("");
    setTripDestination("");
    setTripDuration("");
  };

  const handleTripStart = async (scope) => {
    setTripScope(scope);
    const userText = scope === 'india' ? 'India' : 'International';
    pushUser(userText, true); // Mark as from dropdown
    
    if (scope === 'india') {
      const botMsg1 = 'Awesome! From snow to desert, India has it all.';
      const botMsg2 = 'Choose a destination:';
      await streamBotMessage(botMsg1);
      // Wait for first message to finish speaking before showing next
      setTimeout(async () => {
        await streamBotMessage(botMsg2);
      }, 4000);
    } else {
      const botMsg1 = 'Great choice! Explore top international getaways.';
      const botMsg2 = 'Choose a destination:';
      await streamBotMessage(botMsg1);
      // Wait for first message to finish speaking before showing next
      setTimeout(async () => {
        await streamBotMessage(botMsg2);
      }, 4000);
    }
  };

  const handleDestination = async (val, label) => {
    setTripDestination(val);
    pushUser(label, true); // Mark as from dropdown
    const botMsg = 'Select trip duration:';
    await streamBotMessage(botMsg);
  };

  const handleDuration = async (val, label) => {
    setTripDuration(val);
    pushUser(label, true); // Mark as from dropdown
    const url = getBookingUrl();
    const botMsg1 = 'Thanks for the information.';
    const botMsg2 = 'Open this link to view the package and proceed:';
    await streamBotMessage(botMsg1);
    setTimeout(async () => {
      await streamBotMessage(botMsg2);
      // Add URL as clickable link without speaking it
      setTimeout(() => {
        pushBot(url);
        // Reset for next flow
        setTimeout(() => {
          resetTrip();
        }, 2000);
      }, 2000);
    }, 4000);
  };

  // Handle voice input for TripMall
  const handleVoiceInput = (voiceText) => {
    if (!isTripMall) return;
    
    const normalizedText = voiceText.toLowerCase().trim();
    
    // Check if user said "hi" to start the workflow
    if (normalizedText === 'hi' || normalizedText === 'hello' || normalizedText === 'hey') {
      const welcomeMessages = [
        "Hi\nWelcome to TripMall!",
        "Discover curated trips with easy booking, expert support, and great prices.\nExplore trending destinations for Indian travelers and plan journeys to 30+ locations worldwide.\nWe're just a call or chat away for any help.",
        "Choose your destination from the options below:"
      ];
      
      // Show first message immediately
      pushUser(normalizedText);
      streamBotMessage(welcomeMessages[0]);
      
      // Stream subsequent messages with delays
      setTimeout(() => {
        streamBotMessage(welcomeMessages[1]);
      }, 3000);
      
      setTimeout(() => {
        streamBotMessage(welcomeMessages[2]);
      }, 6000);
      
      return;
    }
    
    const mappedValue = voiceMapping[normalizedText];
    
    if (mappedValue) {
      if (!tripScope) {
        // Handle scope selection
        if (mappedValue === 'india' || mappedValue === 'international') {
          handleTripStart(mappedValue);
        }
      } else if (!tripDestination) {
        // Handle destination selection
        const options = tripScope === 'india' ? INDIA_OPTIONS : INTL_OPTIONS;
        const option = options.find(opt => opt.value === mappedValue);
        if (option) {
          handleDestination(option.value, option.label);
        }
      } else if (!tripDuration) {
        // Handle duration selection
        const option = DURATION_OPTIONS.find(opt => opt.value === mappedValue);
        if (option) {
          handleDuration(option.value, option.label);
        }
      }
    } else {
      // Voice input didn't match any dropdown option
      const botMsg = 'Sorry, I didn\'t understand that. Please use the dropdown or try saying "India", "International", or a destination name.';
      streamBotMessage(botMsg);
    }
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Handle all input for TripMall - only when user presses Enter or sends
  // Don't auto-process while typing

  // Handle text input for TripMall when user sends any message
  useEffect(() => {
    if (isTripMall && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.fromBot && !lastMessage.fromDropdown) {
        // User sent a message (not from dropdown), process it
        setTimeout(() => {
          handleVoiceInput(lastMessage.text.toLowerCase().trim());
        }, 500);
      }
    }
  }, [messages, isTripMall]);

  // Handle text input for TripMall (when user types "hi")
  const handleTripMallTextInput = (text) => {
    if (!isTripMall) return false;
    
    const normalizedText = text.toLowerCase().trim();
    if (normalizedText === 'hi' || normalizedText === 'hello' || normalizedText === 'hey') {
      handleVoiceInput(normalizedText);
      return true;
    }
    return false;
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.fromBot ? "bot-msg" : "user-msg"}>
            {msg.fromBot && (
              <div className="bot-avatar">
                <img src={widgetMode && clientLogo ? clientLogo : "/dodgelogo.png"} alt={widgetMode && clientName ? clientName : "Miraista"} style={{ width: 40, height: 40 }} />
              </div>
            )}
            <div className="message-content">
              {msg.fromBot && <div className="bot-name">{widgetMode && clientName ? clientName : "Miraista"}</div>}
              <div className={`message-bubble ${msg.intro ? 'intro-pop' : ''}`}>
                {renderTextWithLinks(msg.text)}
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
          </div>
        ))}
        
        {isTyping && (
          <div className="bot-msg">
            <div className="bot-avatar">
              <img src={widgetMode && clientLogo ? clientLogo : "/dodgelogo.png"} alt={widgetMode && clientName ? clientName : "Miraista"} />
            </div>
            <div className="message-content">
              <div className="bot-name">{widgetMode && clientName ? clientName : "Miraista"}</div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

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
                  {t("Gallery", "गैलरी", "గ్యాలరీ")}
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
                  {t("Camera", "कैमरा", "కెమెరా")}
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
                    alert(t(
                      "Image size should be less than 5MB",
                      "छवि का आकार 5MB से कम होना चाहिए",
                      "చిత్ర పరిమాణం 5MB కంటే తక్కువగా ఉండాలి"
                    ));
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
                  placeholder={t(
                    "Car Make,Car Model (e.g., Maruti,Swift)",
                    "कार मेक,कार मॉडल (जैसे, Maruti,Swift)",
                    "కారు మేక్, కారు మోడల్ (ఉదా., Maruti, Swift)"
                  )}
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
                    ? t("Processing...", "प्रसंस्करण...", "ప్రాసెస్ అవుతోంది...")
                    : t("Submit", "जमा करें", "సమర్పించండి")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TripMall guided options - modern card design */}
      {isTripMall && (
        <div className="mb-4">
          {!tripScope && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700 shadow-xl">
              <div className="text-sm text-gray-300 mb-3 font-medium">🌍 Choose your travel destination</div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleTripStart('india')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  🇮🇳 India
                </button>
                <button 
                  onClick={() => handleTripStart('international')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  🌍 International
                </button>
              </div>
            </div>
          )}
          {tripScope && !tripDestination && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700 shadow-xl">
              <div className="text-sm text-gray-300 mb-3 font-medium">📍 Choose your destination</div>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {(tripScope==='india'?INDIA_OPTIONS:INTL_OPTIONS).map(o=> (
                  <button 
                    key={o.value}
                    onClick={() => handleDestination(o.value, o.label)}
                    className="bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded-lg transition-all duration-200 hover:shadow-md"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {tripDestination && !tripDuration && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700 shadow-xl">
              <div className="text-sm text-gray-300 mb-3 font-medium">⏰ Choose trip duration</div>
              <div className="grid grid-cols-2 gap-3">
                {DURATION_OPTIONS.map(o=> (
                  <button 
                    key={o.value}
                    onClick={() => handleDuration(o.value, o.label)}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="input-area">
        {isListening ? (
          <div className="recording-container">
            <button onClick={stopListening} className="stop-recording-btn">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                <circle cx="12" cy="12" r="10" />
                <rect x="9" y="9" width="6" height="6" />
              </svg>
            </button>
            <div className="recording-wave">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="recording-text">
              {t("Listening...", "सुन रहा हूँ...", "వింటోంది...")}
            </div>
          </div>
        ) : (language === "te" && isVoiceProcessing) ? (
          <div className="recording-container processing-state">
            <div className="recording-wave">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="recording-text">
              {t("Processing audio...", "ऑडियो संसाधित हो रहा है...", "ఆడియో ప్రాసెస్ అవుతోంది...")}
            </div>
          </div>
        ) : (
          <>
            <button className="mute-button input-control-btn" onClick={toggleMute}>
              {isMuted ? "🔇" : "🔊"}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                if (isTripMall) {
                  // Allow all text input for TripMall - user can type anything
                  setInput(e.target.value);
                  return;
                }
                setInput(e.target.value);
              }}
              onKeyPress={handleKeyPress}
              placeholder={isTripMall ? "Type your message or use dropdowns..." : uiText.placeholder}
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
                disabled={isTyping}
                className={`voice-button input-control-btn ${isListening ? 'active' : ''}`}
                title={t("Voice input", "वॉइस इनपुट", "వాయిస్ ఇన్‌పుట్")}
              >
                {isListening ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="22"></line>
                    <line x1="8" y1="22" x2="16" y2="22"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#9aa3af" stroke="#9aa3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                style={{ background: '#1f2937', border: '1px solid #374151' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#e5e7eb" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </>
        )}
      </div>
      <div className="powered-by">
        Powered by Miraista
      </div>
    </div>
  );
};

export default ChatInterface; 