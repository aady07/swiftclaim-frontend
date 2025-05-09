import React from 'react';
import ChatbotIframe from '../components/chatbot/ChatbotIframe';
import { Helmet } from 'react-helmet';

const ChatbotIframePage = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <Helmet>
        <title>AI Chatbot - Embeddable Version</title>
        <meta name="description" content="Embeddable AI Chatbot for your website" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <ChatbotIframe />
    </div>
  );
};

export default ChatbotIframePage; 