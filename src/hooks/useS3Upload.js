import { useState, useRef } from 'react';
import { authenticatedApiService } from '../services/api/authenticatedApiService';

// Upload Process Logger
const uploadProcessLogger = {
  sessionCount: 0,
  totalSessions: 0,
  sessionStartTime: null,
  
  startSession: (file, carMake, carModel) => {
    uploadProcessLogger.totalSessions++;
    uploadProcessLogger.sessionCount++;
    uploadProcessLogger.sessionStartTime = performance.now();
    
    return {
      sessionId: uploadProcessLogger.sessionCount,
      startTime: uploadProcessLogger.sessionStartTime
    };
  },
  
  logStep: (sessionId, step, progress, details = {}) => {
    const elapsed = performance.now() - uploadProcessLogger.sessionStartTime;
  },
  
  logSuccess: (sessionId, totalDuration, finalData) => {
  },
  
  logError: (sessionId, error, step, duration) => {
  }
};

export const useS3Upload = () => {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState(null);
  const uploadRef = useRef(null);
  const requestIdRef = useRef(null);
  const sessionRef = useRef(null);

  const uploadFileToS3 = async (file, carMake, carModel) => {
    // Generate unique request ID to prevent React StrictMode double execution
    const requestId = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;
    
    // Prevent multiple simultaneous uploads with ref
    if (uploadRef.current) {
      return;
    }

    // Prevent duplicate requests with same request ID
    if (requestIdRef.current === requestId) {
      return;
    }

    uploadRef.current = { file, carMake, carModel };
    requestIdRef.current = requestId;
    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    // Start upload session logging
    const session = uploadProcessLogger.startSession(file, carMake, carModel);
    sessionRef.current = session;

    try {
      // Step 1: Get pre-signed URL (20% progress)
      setUploadProgress(20);
      uploadProcessLogger.logStep(session.sessionId, 'GET_PRESIGNED_URL', 20, {
        fileName: file.name,
        contentType: file.type
      });
      
      const uploadUrlResponse = await authenticatedApiService.claims.getUploadUrl(
        file.name,
        file.type
      );

      if (!uploadUrlResponse.presignedUrl || !uploadUrlResponse.s3Url) {
        throw new Error('Invalid upload URL response from server');
      }

      // Store the fileKey from backend response - this is the UUID we must use
      const backendFileKey = uploadUrlResponse.fileKey;

      // Step 2: Upload file directly to S3 (60% progress)
      setUploadProgress(60);
      uploadProcessLogger.logStep(session.sessionId, 'UPLOAD_TO_S3', 60, {
        fileKey: backendFileKey,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`
      });
      
      await authenticatedApiService.claims.uploadToS3(uploadUrlResponse.presignedUrl, file);

      // Step 3: Submit claim data with S3 image URL (80% progress)
      setUploadProgress(80);
      uploadProcessLogger.logStep(session.sessionId, 'SUBMIT_CLAIM', 80, {
        carMake,
        carModel,
        fileKey: backendFileKey
      });
      
      const claimData = {
        carMake: carMake,
        carModel: carModel,
        imageUrl: uploadUrlResponse.s3Url,
        fileKey: backendFileKey, // Use the SAME fileKey from backend response
        userId: "aady123"
      };
      
      const data = await authenticatedApiService.claims.submitClaim(claimData);
      
      // Step 4: Complete (100% progress)
      setUploadProgress(100);
      uploadProcessLogger.logStep(session.sessionId, 'COMPLETE', 100, {
        hasResponse: !!data,
        responseKeys: data ? Object.keys(data) : []
      });
      
      setUploadStatus('success');
      
      // Log successful completion
      const totalDuration = performance.now() - session.startTime;
      uploadProcessLogger.logSuccess(session.sessionId, totalDuration, data);
      
      // Update upload statistics
      setUploadStats(authenticatedApiService.claims.getLoggingStats());
      
      return data;
    } catch (error) {
      
      // Determine which step failed
      let failedStep = 'UNKNOWN';
      if (uploadProgress < 30) failedStep = 'GET_PRESIGNED_URL';
      else if (uploadProgress < 70) failedStep = 'UPLOAD_TO_S3';
      else if (uploadProgress < 90) failedStep = 'SUBMIT_CLAIM';
      else failedStep = 'COMPLETE';
      
      const duration = performance.now() - session.startTime;
      uploadProcessLogger.logError(session.sessionId, error, failedStep, duration);
      
      setUploadStatus('error');
      setUploadProgress(0);
      throw error;
    } finally {
      setIsUploading(false);
      uploadRef.current = null;
      requestIdRef.current = null;
      sessionRef.current = null;
    }
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadStats(null);
  };

  const getUploadStats = () => {
    return claimService.getLoggingStats();
  };

  return {
    uploadFileToS3,
    uploadStatus,
    uploadProgress,
    uploadStats,
    resetUpload,
    getUploadStats
  };
}; 