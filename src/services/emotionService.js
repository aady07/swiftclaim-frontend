export const useEmotionService = (language) => {
  const detectEmotion = (text) => {
    if (language === "en") {
      const lowerText = text.toLowerCase();
      if (lowerText.includes("happy") || lowerText.includes("great") || lowerText.includes("good")) return "happy";
      if (lowerText.includes("sad") || lowerText.includes("bad") || lowerText.includes("unhappy")) return "sad";
      if (lowerText.includes("angry") || lowerText.includes("mad") || lowerText.includes("furious")) return "angry";
      if (lowerText.includes("surprised") || lowerText.includes("wow") || lowerText.includes("amazing")) return "surprised";
    } else if (language === "hi") {
      const lowerText = text.toLowerCase();
      if (lowerText.includes("खुश") || lowerText.includes("अच्छा") || lowerText.includes("बढ़िया")) return "happy";
      if (lowerText.includes("दुखी") || lowerText.includes("बुरा") || lowerText.includes("उदास")) return "sad";
      if (lowerText.includes("गुस्सा") || lowerText.includes("नाराज") || lowerText.includes("क्रोधित")) return "angry";
      if (lowerText.includes("आश्चर्य") || lowerText.includes("वाह") || lowerText.includes("अद्भुत")) return "surprised";
    }
    return "neutral";
  };

  return {
    detectEmotion
  };
}; 