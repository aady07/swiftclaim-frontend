import React, { useState, useEffect } from 'react';
import Chatbot3D from './Chatbot3D';
import './Chatbot3D.css';

const ChatbotIframe = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState(null);

  // Hardcoded valid ID
  const VALID_ID = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZGFyc2guc2luZ2giLCJpc3MiOiJ2a2FpLWltcGFjdC5jb20iLCJyb2xlIjoiYWRtaW4iLCJyZWdpb24iOiJJTiIsImlhdCI6MTcxNDczODQwMCwiZXhwIjoxNzE0NzQyMDAwfQ.-e0iv4-QhHq9_3O_WrZYiH2rCbx6f4xnpE2UwZ-KS3bTLxBoY0N2StwQKBlauNHnl2xZtwIYf4cpiZKqbHDqVw';

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
      <div 
        className="chatbot-button"
        onClick={toggleChatbot}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <div className="button-pulse"></div>
      </div>
      
      {isOpen && (
        <div className="chatbot-container fullscreen">
          <div className="chatbot-header" style={{ maxWidth: '100%', width: '100%', padding: '10px 24px' }}>
            <h3 style={{ 
              fontWeight: '600',
              fontSize: '16px',
              letterSpacing: '0.2px',
              textTransform: 'uppercase',
              background: 'linear-gradient(to right, #fff, #d4e1ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              width: 'auto',
              maxWidth: '200px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '1.2',
              margin: '0'
            }}>Enterprise Assistant</h3>
            <div className="header-controls">
              <button className="close-btn" onClick={toggleChatbot}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Chatbot3D isFullPage={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotIframe; 