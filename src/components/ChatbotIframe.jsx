import React, { useState, useEffect } from 'react';
import Chatbot3D from './Chatbot3D';
import './Chatbot3D.css';

const ChatbotIframe = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState(null);

  // Hardcoded valid ID
  const VALID_ID = 'swiftclaim123';

  useEffect(() => {
    const validateId = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');

      if (id === VALID_ID) {
        setIsAuthorized(true);
      } else if (id) {
        setError('Access denied: Invalid ID');
      } else {
        setError('Access denied: No ID provided');
      }
    };

    validateId();
  }, []);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        {error || 'Access denied'}
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {!isOpen && (
        <div 
          className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
          onClick={toggleChatbot}
        >
          <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
        </div>
      )}
      
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleChatbot}></div>
          <div className="absolute bottom-0 right-0 w-full h-full md:w-96 md:h-[600px]">
            <Chatbot3D isFullPage={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotIframe; 