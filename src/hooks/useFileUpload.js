import { useState, useRef } from 'react';
import { claimService } from '../services/api/claimService';

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

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("carMake", carMake);
    formData.append("carModel", carModel);

    try {
      const data = await claimService.uploadClaim(formData);
      
      if (data) {
        const damageStatus = data.model1_output?.[0]?.label || "Unknown";
        const damagedParts = data.parts || [];
        const costEstimates = data.cost || [];
        
        const damageImage = data.model1_output?.[0]?.output_image_base64;
        const partsImage = data.model2_output?.[0]?.output2_image_base64;

        setUploadStatus("idle");
        setSelectedFile(null);
        setCarInput("");

        if (damageImage) {
          const damageImageUrl = damageImage.startsWith('data') ? damageImage : `data:image/png;base64,${damageImage}`;
          addMessage("Damage Detection Image:", true, damageImageUrl);
        }
        if (partsImage) {
          const partsImageUrl = partsImage.startsWith('data') ? partsImage : `data:image/png;base64,${partsImage}`;
          addMessage("Parts Detection Image:", true, partsImageUrl);
        }
        
        let detailedMessage = language === "en" 
          ? `Based on my analysis:\n\n Damage Status: ${damageStatus}\n\n`
          : `मेरे विश्लेषण के अनुसार:\n\n🔍 क्षति स्थिति: ${damageStatus}\n\n`;

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
      }
    } catch {
      const errorMessage = language === "en"
        ? "I'm having trouble analyzing your claim at the moment. This sometimes happens, but don't worry! Could you try uploading the image again?"
        : "मुझे इस समय आपके दावे का विश्लेषण करने में परेशानी हो रही है। ऐसा कभी-कभी होता है, लेकिन चिंता न करें! क्या आप छवि को फिर से अपलोड करने का प्रयास कर सकते हैं?";

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