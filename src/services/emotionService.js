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
    } else if (language === "te") {
      const lowerText = text.toLowerCase();
      if (lowerText.includes("సంతోష") || lowerText.includes("చాలా బాగుంది") || lowerText.includes("హ్యాపీ")) return "happy";
      if (lowerText.includes("విషాద") || lowerText.includes("బాధ") || lowerText.includes("దుఃఖం")) return "sad";
      if (lowerText.includes("కోపం") || lowerText.includes("ఆగ్రహం")) return "angry";
      if (lowerText.includes("ఆశ్చర్య") || lowerText.includes("వావ్") || lowerText.includes("అద్భుత")) return "surprised";
    }
    return "neutral";
  };

  return {
    detectEmotion
  };
}; 