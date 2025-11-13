import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { getLanguageLocale } from '../utils/languageUtils';

// Browser SpeechRecognition state (for Hindi and English)
let isProcessing = false;
let recognitionTimeout = null;
let speechBuffer = '';
let lastSpeechTime = 0;
const MIN_SPEECH_DURATION = 500; // Minimum duration in ms to consider as valid speech
let isSending = false; // Flag to prevent multiple sends
let finalTranscriptBuffer = ''; // Buffer for final transcript

// Audio recording for backend STT (for Telugu only)
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let audioStream = null;
let recordingStartTime = 0;

export const useSpeechService = (language) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const t = (englishText, hindiText, teluguText = englishText) => {
    if (language === "hi") return hindiText;
    if (language === "te") return teluguText;
    return englishText;
  };

  // Check if we should use backend STT (Telugu) or browser SpeechRecognition (Hindi/English)
  const useBackendSTT = language === "te";

  const speak = async (text, isMuted) => {
    if (isMuted) return;
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('language', getLanguageLocale(language));
      console.log('[TTS] Sending request to /speech/tts', {
        url: 'https://aadybackend.site/api/speech/tts',
        payload: {
          text,
          language: getLanguageLocale(language)
        }
      });
      const response = await fetch('https://aadybackend.site/api/speech/tts', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('TTS API error');
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new window.Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error('TTS error:', err);
    }
  };

  const getSupportedMimeType = () => {
    if (typeof window === 'undefined' || !window.MediaRecorder) {
      return null;
    }

    const preferredTypes = [
      'audio/mpeg',
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/webm',
      'audio/ogg'
    ];

    return preferredTypes.find(type => window.MediaRecorder.isTypeSupported(type)) || null;
  };

  const audioBufferToWav = (audioBuffer) => {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const bytesPerSample = 2;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataLength = audioBuffer.length * blockAlign;
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    let offset = 0;

    const writeString = (string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
      offset += string.length;
    };

    const writeUint32 = (value) => {
      view.setUint32(offset, value, true);
      offset += 4;
    };

    const writeUint16 = (value) => {
      view.setUint16(offset, value, true);
      offset += 2;
    };

    writeString('RIFF');
    writeUint32(36 + dataLength);
    writeString('WAVE');
    writeString('fmt ');
    writeUint32(16);
    writeUint16(1);
    writeUint16(numChannels);
    writeUint32(sampleRate);
    writeUint32(byteRate);
    writeUint16(blockAlign);
    writeUint16(bytesPerSample * 8);
    writeString('data');
    writeUint32(dataLength);

    const channelData = [];
    for (let channel = 0; channel < numChannels; channel++) {
      channelData.push(audioBuffer.getChannelData(channel));
    }

    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        let sample = channelData[channel][i];
        sample = Math.max(-1, Math.min(1, sample));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, sample, true);
        offset += 2;
      }
    }

    return buffer;
  };

  const convertRecordingToUploadBlob = async (audioBlob) => {
    const mimeType = audioBlob.type || '';

    if (mimeType.includes('mpeg') || mimeType.includes('mp3')) {
      return { blob: audioBlob, extension: 'mp3' };
    }

    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      const decoded = await audioContext.decodeAudioData(arrayBuffer);
      const wavBuffer = audioBufferToWav(decoded);
      audioContext.close?.();
      const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
      return { blob: wavBlob, extension: 'wav' };
    } catch (error) {
      console.error('[Voice] Failed to convert recording to WAV, falling back to original blob', error);
      return { blob: audioBlob, extension: mimeType.split('/')[1] || 'webm' };
    }
  };

  const transcribeAudioWithBackend = async (audioBlob, extension) => {
    try {
      console.log('[Voice] Sending audio to backend STT', {
        language: getLanguageLocale(language),
        audioSize: audioBlob.size,
        extension
      });
      const formData = new FormData();
      formData.append('file', audioBlob, `audio.${extension || 'wav'}`);
      formData.append('language', getLanguageLocale(language));
      const response = await fetch('https://aadybackend.site/api/speech/stt', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error(`STT API error: ${response.status}`);
      }
      const text = await response.text();
      console.log('[Voice] Backend STT transcript received', { text });
      return text.trim();
    } catch (err) {
      console.error('[Voice] Backend STT error:', err);
      return '';
    }
  };

  const cleanupRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = null;
      mediaRecorder.onerror = null;
      mediaRecorder.onstop = null;
      mediaRecorder = null;
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      audioStream = null;
    }
    audioChunks = [];
  };

  const startListening = async (setIsListening) => {
    console.log('[Voice] startListening requested', { language, useBackendSTT });

    // Route to backend STT for Telugu
    if (useBackendSTT) {
      if (isRecording) {
        console.log('[Voice] startListening aborted: already recording');
        return;
      }
      
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('[Voice] Microphone access granted for recording (Telugu - Backend STT)');
      } catch (error) {
        console.error('[Voice] Microphone access error:', error);
        alert(t(
          "Microphone access is required for voice input.",
          "वॉइस इनपुट के लिए माइक्रोफोन एक्सेस आवश्यक है।",
          "వాయిస్ ఇన్‌పుట్ కోసం మైక్రోఫోన్ యాక్సెస్ అవసరం."
        ));
        return;
      }
      
      try {
        const mimeType = getSupportedMimeType();
        audioChunks = [];
        mediaRecorder = mimeType
          ? new MediaRecorder(audioStream, { mimeType })
          : new MediaRecorder(audioStream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onerror = (event) => {
          console.error('[Voice] MediaRecorder error:', event.error);
          alert(t(
            "There was an error while recording. Please try again.",
            "रिकॉर्डिंग में त्रुटि हुई। कृपया पुनः प्रयास करें।",
            "రికార్డింగ్‌లో లోపం వచ్చింది. దయచేసి మరోసారి ప్రయత్నించండి."
          ));
          cleanupRecording();
          setIsListening(false);
          isRecording = false;
        };

        mediaRecorder.start();
        isRecording = true;
        recordingStartTime = Date.now();
        setIsListening(true);
        console.log('[Voice] Recording started (Telugu - Backend STT)', { mimeType: mediaRecorder.mimeType });
      } catch (error) {
        console.error('[Voice] Failed to start MediaRecorder:', error);
        alert(t(
          "Unable to start recording. Please try again.",
          "रिकॉर्डिंग शुरू नहीं हो सकी। कृपया पुनः प्रयास करें।",
          "రికార్డింగ్‌ను ప్రారంభించలేకపోయాం. దయచేసి మరోసారి ప్రయత్నించండి."
        ));
        cleanupRecording();
        setIsListening(false);
        isRecording = false;
      }
      return;
    }

    // Browser SpeechRecognition for Hindi and English
    if (isProcessing || isSending) {
      console.log('[Voice] startListening aborted: busy state');
      return;
    }
    
    if (!browserSupportsSpeechRecognition) {
      console.warn('[Voice] Speech recognition not supported in browser');
      alert(t(
        "Your browser does not support speech recognition.",
        "आपका ब्राउज़र स्पीच रिकग्निशन का समर्थन नहीं करता है।",
        "మీ బ్రౌజర్ స్పీచ్ గుర్తింపును మద్దతు ఇవ్వదు."
      ));
      return;
    }
    
    speechBuffer = '';
    finalTranscriptBuffer = '';
    lastSpeechTime = Date.now();
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log('[Voice] Microphone access granted (Browser SpeechRecognition)');
        if (recognitionTimeout) {
          clearTimeout(recognitionTimeout);
          recognitionTimeout = null;
        }
        
        try {
          SpeechRecognition.stopListening();
        } catch (error) {
          console.error('Error stopping existing recognition:', error);
        }
        
        resetTranscript();
        setIsListening(true);
        isProcessing = true;
        
        try {
          const recognitionLang = language === "hi"
            ? "hi-IN"
            : "en-IN";
          console.log('[Voice] Starting SpeechRecognition', { recognitionLang });
          SpeechRecognition.startListening({ 
            continuous: true,
            interimResults: true,
            language: recognitionLang
          });
          console.log('[Voice] SpeechRecognition started successfully');
        } catch (error) {
          console.error('Error starting SpeechRecognition:', error);
          setIsListening(false);
          isProcessing = false;
          alert(t(
            "Error starting speech recognition. Please try again.",
            "स्पीच रिकग्निशन शुरू करने में त्रुटि। कृपया पुनः प्रयास करें।",
            "స్పీచ్ గుర్తింపును ప్రారంభించడంలో లోపం. దయచేసి మరోసారి ప్రయత్నించండి."
          ));
        }
      })
      .catch(error => {
        console.error('Microphone access error:', error);
        isProcessing = false;
        alert(t(
          "Microphone access is required for voice input.",
          "वॉइस इनपुट के लिए माइक्रोफोन एक्सेस आवश्यक है।",
          "వాయిస్ ఇన్‌పుట్ కోసం మైక్రోఫోన్ యాక్సెస్ అవసరం."
        ));
      });
  };

  const stopListening = async (setIsListening, setInput) => {
    console.log('[Voice] stopListening requested', { language, useBackendSTT, isRecording, isProcessing });

    // Handle backend STT for Telugu
    if (useBackendSTT) {
      if (!isRecording || !mediaRecorder) {
        console.log('[Voice] stopListening aborted: no active recording');
        return;
      }
      
      setIsListening(false);
      isRecording = false;

      return new Promise((resolve) => {
        mediaRecorder.onstop = async () => {
          try {
            const recordingDuration = Date.now() - recordingStartTime;
            console.log('[Voice] Recording stopped (Telugu - Backend STT)', {
              chunks: audioChunks.length,
              duration: recordingDuration
            });

            if (!audioChunks.length) {
              console.warn('[Voice] No audio captured during recording');
              cleanupRecording();
              resolve();
              return;
            }

            const rawBlob = new Blob(audioChunks, {
              type: mediaRecorder.mimeType || 'audio/webm'
            });
            const { blob: uploadBlob, extension } = await convertRecordingToUploadBlob(rawBlob);
            cleanupRecording();

            if (!uploadBlob || !uploadBlob.size) {
              console.warn('[Voice] Processed audio blob is empty');
              resolve();
              return;
            }
      
            const transcript = await transcribeAudioWithBackend(uploadBlob, extension);

            if (transcript) {
              setInput(transcript);
            } else {
              alert(t(
                "Sorry, I couldn't understand that. Please try again.",
                "क्षमा करें, मैं उसे समझ नहीं सका। कृपया पुनः प्रयास करें।",
                "క్షమించండి, నేను వినలేకపోయాను. దయచేసి మరోసారి ప్రయత్నించండి."
              ));
            }
          } catch (error) {
            console.error('[Voice] Error processing recorded audio:', error);
            alert(t(
              "There was an error processing your recording. Please try again.",
              "आपकी रिकॉर्डिंग को संसाधित करने में त्रुटि हुई। कृपया पुनः प्रयास करें।",
              "మీ రికార్డింగ్‌ను ప్రాసెస్ చేయడంలో లోపం వచ్చింది. దయచేసి మరోసారి ప్రయత్నించండి."
            ));
            cleanupRecording();
          } finally {
            resolve();
          }
        };

        try {
          mediaRecorder.stop();
        } catch (error) {
          console.error('[Voice] Error stopping MediaRecorder:', error);
          cleanupRecording();
          resolve();
        }
      });
    }

    // Handle browser SpeechRecognition for Hindi and English
    if (!isProcessing || isSending) {
      console.log('[Voice] stopListening aborted: not processing or sending');
      return;
    }
    
    setIsListening(false);
    isProcessing = false;
    
    try {
      SpeechRecognition.stopListening();
    } catch (error) {
      console.error('Error stopping SpeechRecognition:', error);
    }
    
    // Check if the speech duration is long enough
    const speechDuration = Date.now() - lastSpeechTime;
    console.log('[Voice] Speech duration (Browser SpeechRecognition)', { speechDuration });
    if (speechDuration < MIN_SPEECH_DURATION) {
      console.log('[Voice] Speech duration below threshold, ignoring transcript');
      return;
    }
    
    // Use the final transcript buffer
    const finalTranscript = finalTranscriptBuffer || transcript;
    console.log('[Voice] Final transcript obtained (Browser SpeechRecognition)', { finalTranscript });
    
    if (finalTranscript && finalTranscript.trim()) {
      // Set the input instead of directly sending
      setInput(finalTranscript.trim());
      finalTranscriptBuffer = ''; // Clear the buffer after setting input
    }
  };

  // Update the final transcript buffer when we get a complete phrase (for browser SpeechRecognition)
  if (!useBackendSTT && transcript && !listening) {
    console.log('[Voice] Updating final transcript buffer', { transcript });
    finalTranscriptBuffer = transcript;
  }

  return {
    transcript: useBackendSTT ? '' : transcript,
    listening: useBackendSTT ? isRecording : listening,
    resetTranscript: useBackendSTT ? () => {} : resetTranscript,
    browserSupportsSpeechRecognition: useBackendSTT ? true : browserSupportsSpeechRecognition,
    speak,
    startListening,
    stopListening
  };
}; 