import { useState, useRef } from 'react';

export const useChatState = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const addMessage = (text, fromBot = false, image = null) => {
    setMessages(prev => [...prev, { text, fromBot, image }]);
  };

  const clearInput = () => {
    setInput("");
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    messagesEndRef,
    addMessage,
    clearInput
  };
}; 