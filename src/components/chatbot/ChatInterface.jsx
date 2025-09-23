import React, { useEffect } from 'react';

const ChatInterface = ({
  messages,
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
  const uiText = {
    chatbotTitle: language === "en" ? "Enterprise Assistant" : "उद्यम सहायक",
    placeholder: language === "en" ? "Type your message..." : "अपना संदेश टाइप करें...",
    chooseLanguage: language === "en" ? "Choose Language" : "भाषा चुनें",
    typingIndicator: language === "en" ? "Typing..." : "टाइप कर रहा है...",
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.fromBot ? "bot-msg" : "user-msg"}>
            {msg.fromBot && (
              <div className="bot-avatar">
                <img src={widgetMode && clientLogo ? clientLogo : "/dodgelogo.png"} alt={widgetMode && clientName ? clientName : "Miraista"} />
              </div>
            )}
            <div className="message-content">
              {msg.fromBot && <div className="bot-name">{widgetMode && clientName ? clientName : "Miraista"}</div>}
              <div className={`message-bubble ${msg.intro ? 'intro-pop' : ''}`}>
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
              {language === "en" ? "Listening..." : "सुन रहा हूँ..."}
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
                disabled={isTyping}
                className={`voice-button input-control-btn ${isListening ? 'active' : ''}`}
                title={language === "en" ? "Voice input" : "वॉइस इनपुट"}
              >
                {isListening ? (
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
      <div className="powered-by">
        Powered by Miraista
      </div>
    </div>
  );
};

export default ChatInterface; 