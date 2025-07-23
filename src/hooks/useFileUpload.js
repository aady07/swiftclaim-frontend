import { useState, useRef } from 'react';
import { useS3Upload } from './useS3Upload';
import { authenticatedApiService } from '../services/api/authenticatedApiService';
import { useCognitoAuth } from './useCognitoAuth';

export const useFileUpload = (language, { addMessage, speak, setIsTyping, setIsTalking, isMuted, setShowImageUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [carInput, setCarInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const fileInputRef = useRef(null);
  const { uploadFileToS3 } = useS3Upload();
  const { getUserId } = useCognitoAuth();

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
      const userId = await getUserId();
      const data = await uploadFileToS3(selectedFile, carMake, carModel, userId);
      if (data && data.claimId && data.success) {
        // Fetch claim results and images
        const results = await authenticatedApiService.claims.getClaimResults(data.claimId);
        let damageImageUrl = null;
        let partsImageUrl = null;
        try {
          const [model1Blob, model2Blob] = await Promise.all([
            authenticatedApiService.claims.getModel1Image(data.claimId),
            authenticatedApiService.claims.getModel2Image(data.claimId)
          ]);
          damageImageUrl = URL.createObjectURL(model1Blob);
          partsImageUrl = URL.createObjectURL(model2Blob);
        } catch (imgErr) {
          // Ignore image errors, just don't show images
        }
        // Show images in chat
        if (damageImageUrl) {
          addMessage("Damage Detection Image:", true, damageImageUrl);
        }
        if (partsImageUrl) {
          addMessage("Parts Detection Image:", true, partsImageUrl);
        }
        // Build detailed message
        let damageStatus = results.modelOutputs?.[0]?.label || "Unknown";
        let confidenceScore = results.modelOutputs?.[0]?.confidence
          ? (parseFloat(results.modelOutputs[0].confidence) * 100).toFixed(2)
          : null;
        let damagedParts = results.costings?.map(item => item.part).filter(part => part !== 'Unknown') || [];
        let costEstimates = results.costings?.map(item => item.price) || [];
        let detailedMessage = language === "en"
          ? `Based on my analysis:\n\n🔍 Damage Status: ${damageStatus}\n`
          : `मेरे विश्लेषण के अनुसार:\n\n🔍 क्षति स्थिति: ${damageStatus}\n`;
        if (confidenceScore) {
          detailedMessage += language === "en"
            ? `📊 Confidence: ${confidenceScore}%\n\n`
            : `📊 विश्वास: ${confidenceScore}%\n\n`;
        } else {
          detailedMessage += "\n";
        }
        if (damagedParts.length > 0) {
          detailedMessage += language === "en" ? "🚗 Damaged Parts:\n" : "🚗 क्षतिग्रस्त भाग:\n";
          damagedParts.forEach((part, index) => {
            const formattedPart = part.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const priceRange = costEstimates[index] || "Price not available";
            detailedMessage += language === "en"
              ? `• ${formattedPart}: ₹${priceRange}\n`
              : `• ${formattedPart}: ₹${priceRange}\n`;
          });
        }
        detailedMessage += language === "en"
          ? "\nWould you like to know anything else about your claim?"
          : "\nक्या आप अपने दावे के बारे में कुछ और जानना चाहेंगे?";
        setIsTyping(false);
        setIsTalking(true);
        speak(detailedMessage, isMuted);
        addMessage(detailedMessage, true);
        setTimeout(() => setIsTalking(false), 500);
        setUploadStatus("idle");
        setSelectedFile(null);
        setCarInput("");
      } else {
        throw new Error('Claim upload did not return a valid claim ID.');
      }
    } catch (error) {
      // Logging removed
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