import { useState, useRef } from 'react';
import { claimService } from '../services/api/claimService';

export const useFileUpload = (language, { addMessage, speak, setIsTyping, setIsTalking, isMuted, setShowImageUpload, setShowCarInput }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [carInput, setCarInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const fileInputRef = useRef(null);

  const t = (englishText, hindiText, teluguText = englishText) => {
    if (language === "hi") return hindiText;
    if (language === "te") return teluguText;
    return englishText;
  };

  const handleCarDetails = async () => {
    // Ensure any pending streaming interval from the prompt is cleared
    if (window.currentResponseInterval) {
      clearInterval(window.currentResponseInterval);
      window.currentResponseInterval = null;
    }
    if (!carInput.includes(',')) {
      const errorMessage = t(
        "Please provide car make and model separated by comma (e.g., Maruti,Swift)",
        "कृपया कार का मेक और मॉडल कॉमा से अलग करके दें (जैसे, Maruti,Swift)",
        "దయచేసి కార్ మేక్ మరియు మోడల్‌ను కామాతో వేరు చేసి ఇవ్వండి (ఉదా., Maruti, Swift)"
      );
      
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
      const errorMessage = t(
        "Please provide both car make and model",
        "कृपया कार का मेक और मॉडल दोनों प्रदान करें",
        "దయచేసి కార్ మేక్ మరియు మోడల్ రెండింటినీ ఇవ్వండి"
      );
      
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
    // Hide upload UI and car input while processing
    setShowImageUpload(false);
    if (setShowCarInput) {
      setShowCarInput(false);
    }
    const processingMessage = t(
      "I'm analyzing your vehicle damage. This will take just a moment...",
      "मैं आपके वाहन की क्षति का विश्लेषण कर रहा हूं। इसमें कुछ समय लगेगा...",
      "నేను మీ వాహన నష్టాన్ని విశ్లేషిస్తున్నాను. ఇది కేవలం కొద్దిసేపు పడుతుంది..."
    );
    
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
        console.log('Processing claim response data:', data);
        
        // Handle model1_output - damage detection
        let damageStatus = "Unknown";
        let confidenceScore = null;
        let fileFormat = null;
        let damageImageUrl = null;
        
        if (data.model1_output && data.model1_output.length > 0) {
          // First object contains damage detection info
          const damageInfo = data.model1_output.find(item => item.label);
          if (damageInfo) {
            console.log('Damage info:', damageInfo);
            damageStatus = damageInfo.label;
            if (damageInfo.confidence) {
              confidenceScore = (damageInfo.confidence * 100).toFixed(2);
            }
            fileFormat = damageInfo.file_format;
          }
          
          // Second object contains image data
          const damageImageData = data.model1_output.find(item => item.output_image_base64);
          if (damageImageData && damageImageData.output_image_base64 && damageImageData.output_image_base64 !== 'undefined') {
            console.log('Damage image found');
            const damageImage = damageImageData.output_image_base64;
            damageImageUrl = damageImage.startsWith('data') 
              ? damageImage 
              : `data:image/${damageInfo?.file_format || 'png'};base64,${damageImage}`;
          }
        }

        // Handle model2_output - parts detection
        let partsImageUrl = null;
        if (data.model2_output && data.model2_output.length > 0) {
          // Extract parts image data
          const partsImageData = data.model2_output.find(item => item.output2_image_base64);
          if (partsImageData && partsImageData.output2_image_base64 && partsImageData.output2_image_base64 !== 'undefined') {
            console.log('Parts image found');
            const partsImage = partsImageData.output2_image_base64;
            partsImageUrl = partsImage.startsWith('data')
              ? partsImage
              : `data:image/${fileFormat || 'png'};base64,${partsImage}`;
          }
        }

        // Handle costing data
        let damagedParts = [];
        let costEstimates = [];
        if (data.costing && Array.isArray(data.costing)) {
          console.log('Costing data:', data.costing);
          
          // Extract parts from costing array
          damagedParts = data.costing.map(item => item.part).filter(part => part !== 'Unknown');
          
          // Extract prices from costing array
          costEstimates = data.costing.map(item => item.price).filter(Boolean);
        }

        setUploadStatus("idle");
        setSelectedFile(null);
        setCarInput("");
        // Ensure inputs remain hidden after successful processing
        if (setShowCarInput) {
          setShowCarInput(false);
        }
        setShowImageUpload(false);

        // Display images if available
        if (damageImageUrl) {
          addMessage("Damage Detection Image:", true, damageImageUrl);
        }
        if (partsImageUrl) {
          addMessage("Parts Detection Image:", true, partsImageUrl);
        }
        
        // Build detailed message
        let detailedMessage = t(
          `Based on my analysis:\n\n🔍 Damage Status: ${damageStatus}\n`,
          `मेरे विश्लेषण के अनुसार:\n\n🔍 क्षति स्थिति: ${damageStatus}\n`,
          `నా విశ్లేషణ ఆధారంగా:\n\n🔍 నష్టం స్థితి: ${damageStatus}\n`
        );

        // Add confidence score if available
        if (confidenceScore) {
          detailedMessage += t(
            `📊 Confidence: ${confidenceScore}%\n\n`,
            `📊 विश्वास: ${confidenceScore}%\n\n`,
            `📊 నమ్మకం: ${confidenceScore}%\n\n`
          );
        } else {
          detailedMessage += "\n";
        }

        // Add damaged parts and cost estimates
        if (damagedParts.length > 0) {
          detailedMessage += t(
            "🚗 Damaged Parts:\n",
            "🚗 क्षतिग्रस्त भाग:\n",
            "🚗 దెబ్బతిన్న భాగాలు:\n"
          );
          
          damagedParts.forEach((part, index) => {
            const formattedPart = part.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            const priceRange = costEstimates[index] || t("Price not available", "मूल्य उपलब्ध नहीं", "ధర అందుబాటులో లేదు");
            
            detailedMessage += `• ${formattedPart}: ₹${priceRange}\n`;
          });
        }

        detailedMessage += t(
          "\nWould you like to know anything else about your claim?",
          "\nक्या आप अपने दावे के बारे में कुछ और जानना चाहेंगे?",
          "\nమీ క్లెయిమ్ గురించి మరేదైనా తెలుసుకోవాలనుకుంటున్నారా?"
        );

        setIsTyping(false);
        setIsTalking(true);
        speak(detailedMessage, isMuted);
        addMessage(detailedMessage, true);
        
        setTimeout(() => setIsTalking(false), 500);
      }
    } catch (error) {
      console.error('Error processing claim:', error);
      const errorMessage = t(
        "I'm having trouble analyzing your claim right now. You can tap Submit again to retry.",
        "मुझे अभी आपके दावे का विश्लेषण करने में समस्या हो रही है। आप फिर से प्रयास करने के लिए सबमिट दबा सकते हैं।",
        "ప్రస్తుతం మీ క్లెయిమ్‌ను విశ్లేషించడంలో ఇబ్బంది ఎదుర్కొంటున్నాను. మళ్లీ ప్రయత్నించడానికి Submit పై ట్యాప్ చేయండి."
      );

      // Don't clear selections or re-open upload UI; allow quick retry with same inputs
      setUploadStatus("idle");
      if (setShowCarInput) {
        setShowCarInput(true);
      }
      setShowImageUpload(false);

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