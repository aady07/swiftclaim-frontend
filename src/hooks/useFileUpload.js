import { useState, useRef } from 'react';

export const useFileUpload = (language, { addMessage, speak, setIsTyping, setIsTalking, isMuted, setShowImageUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [carInput, setCarInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const fileInputRef = useRef(null);

  const handleCarDetails = async () => {
    if (!carInput.includes(',')) {
      const errorMessage = language === "en"
        ? "Please provide car make and model separated by comma (e.g., Maruti,Swift)"
        : "कृपया कार का मेक और मॉडल कॉमा से अलग करके दें (जैसे, Maruti,Swift)";
      
      setUploadStatus("idle");
      
      setIsTyping(true);
      setIsTalking(false);
      
      setTimeout(() => {
        setIsTyping(false);
        setIsTalking(true);
        speak(errorMessage, isMuted);
        addMessage(errorMessage, true);
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
        speak(errorMessage, isMuted);
        addMessage(errorMessage, true);
        setTimeout(() => setIsTalking(false), 500);
      }, 500);
      return;
    }

    setUploadStatus("uploading");
    setShowImageUpload(false);
    const processingMessage = language === "en"
      ? "I'm analyzing your vehicle damage. This will take just a moment..."
      : "मैं आपके वाहन की क्षति का विश्लेषण कर रहा हूं। इसमें कुछ समय लगेगा...";
    
    setIsTyping(true);
    setIsTalking(false);
    
    setTimeout(() => {
      setIsTyping(false);
      setIsTalking(true);
      speak(processingMessage, isMuted);
      addMessage(processingMessage, true);
      setTimeout(() => setIsTalking(false), 500);
    }, 500);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Hardcoded analysis results
      const damageStatus = "scratch";
      const confidenceScore = "86.32";
      const damageImageUrl = "/claim1.jpeg";
      const partsImageUrl = "/claim2.jpeg";
      const damagedParts = ["door-outer dent", "door-outer"];
      const costEstimates = ["2000-6000", "3000-5000"];

      setUploadStatus("idle");
      setSelectedFile(null);
      setCarInput("");

      // Show images in chat
      addMessage("Damage Detection Image:", true, damageImageUrl);
      addMessage("Parts Detection Image:", true, partsImageUrl);

      // Build detailed message
      let detailedMessage = language === "en" 
        ? `Based on my analysis:\n\n🔍 Damage Status: ${damageStatus}\n`
        : `मेरे विश्लेषण के अनुसार:\n\n🔍 क्षति स्थिति: ${damageStatus}\n`;

      detailedMessage += language === "en"
        ? `📊 Confidence: ${confidenceScore}%\n\n`
        : `📊 विश्वास: ${confidenceScore}%\n\n`;

      detailedMessage += language === "en" ? "🚗 Damaged Parts:\n" : "🚗 क्षतिग्रस्त भाग:\n";
      damagedParts.forEach((part, index) => {
        const formattedPart = part.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        const priceRange = costEstimates[index] || "Price not available";
        detailedMessage += language === "en"
          ? `• ${formattedPart}: ₹${priceRange}\n`
          : `• ${formattedPart}: ₹${priceRange}\n`;
      });

      detailedMessage += language === "en"
        ? "\nWould you like to know anything else about your claim?"
        : "\nक्या आप अपने दावे के बारे में कुछ और जानना चाहेंगे?";

      setIsTyping(false);
      setIsTalking(true);
      speak(detailedMessage, isMuted);
      addMessage(detailedMessage, true);
      setTimeout(() => setIsTalking(false), 500);
    } catch (error) {
      console.error('Error during mocked claim processing:', error);
      const errorMessage = language === "en"
        ? "I'm having trouble analyzing your claim at the moment. Please try again."
        : "मुझे इस समय आपके दावे का विश्लेषण करने में परेशानी हो रही है। कृपया पुनः प्रयास करें।";
      setUploadStatus("idle");
      setSelectedFile(null);
      setCarInput("");
      setShowImageUpload(true);
      setIsTyping(false);
      setIsTalking(true);
      speak(errorMessage, isMuted);
      addMessage(errorMessage, true);
      setTimeout(() => setIsTalking(false), 500);
    }
  };

  return {
    selectedFile,
    setSelectedFile,
    carInput,
    setCarInput,
    uploadStatus,
    setUploadStatus,
    fileInputRef,
    handleCarDetails
  };
}; 