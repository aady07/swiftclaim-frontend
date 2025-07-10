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
    
    console.log(`🚀 [UPLOAD SESSION START #${uploadProcessLogger.sessionCount}]`, {
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      fileType: file.type,
      carMake,
      carModel,
      timestamp: new Date().toISOString(),
      totalSessions: uploadProcessLogger.totalSessions
    });
    
    return {
      sessionId: uploadProcessLogger.sessionCount,
      startTime: uploadProcessLogger.sessionStartTime
    };
  },
  
  logStep: (sessionId, step, progress, details = {}) => {
    const elapsed = performance.now() - uploadProcessLogger.sessionStartTime;
    
    console.log(`📊 [UPLOAD STEP #${sessionId}]`, {
      step,
      progress: `${progress}%`,
      elapsed: `${elapsed.toFixed(2)}ms`,
      ...details
    });
  },
  
  logSuccess: (sessionId, totalDuration, finalData) => {
    console.log(`🎉 [UPLOAD SESSION SUCCESS #${sessionId}]`, {
      totalDuration: `${totalDuration.toFixed(2)}ms`,
      hasModel1Output: !!finalData?.model1_output,
      hasModel2Output: !!finalData?.model2_output,
      hasCosting: !!finalData?.costing,
      responseSize: JSON.stringify(finalData).length
    });
  },
  
  logError: (sessionId, error, step, duration) => {
    console.log(`💥 [UPLOAD SESSION ERROR #${sessionId}]`, {
      step,
      error: error.message || error,
      duration: `${duration.toFixed(2)}ms`,
      totalSessions: uploadProcessLogger.totalSessions
    });
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
      console.log('⚠️ [DUPLICATE UPLOAD] Upload already in progress, ignoring duplicate call');
      return;
    }

    // Prevent duplicate requests with same request ID
    if (requestIdRef.current === requestId) {
      console.log('⚠️ [DUPLICATE REQUEST] Duplicate request ID detected, ignoring');
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
      
      console.log('🔗 [STEP 1] Getting pre-signed URL for file:', file.name);
      const uploadUrlResponse = await authenticatedApiService.claims.getUploadUrl(
        file.name,
        file.type
      );

      console.log('🔗 [STEP 1 COMPLETE] Pre-signed URL response received:', {
        fileKey: uploadUrlResponse.fileKey,
        s3Url: uploadUrlResponse.s3Url.substring(0, 100) + '...',
        hasPresignedUrl: !!uploadUrlResponse.presignedUrl
      });

      if (!uploadUrlResponse.presignedUrl || !uploadUrlResponse.s3Url) {
        throw new Error('Invalid upload URL response from server');
      }

      // Store the fileKey from backend response - this is the UUID we must use
      const backendFileKey = uploadUrlResponse.fileKey;
      console.log('🔑 [UUID TRACKING] Backend provided fileKey:', backendFileKey);

      // Step 2: Upload file directly to S3 (60% progress)
      setUploadProgress(60);
      uploadProcessLogger.logStep(session.sessionId, 'UPLOAD_TO_S3', 60, {
        fileKey: backendFileKey,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`
      });
      
      console.log('📤 [STEP 2] Uploading file to S3 with fileKey:', backendFileKey);
      console.log('🔑 [UUID TRACKING] S3 upload using fileKey:', backendFileKey);
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

      console.log('📋 [STEP 3] Submitting claim with data:', {
        carMake: claimData.carMake,
        carModel: claimData.carModel,
        fileKey: claimData.fileKey,
        imageUrl: claimData.imageUrl.substring(0, 100) + '...'
      });
      console.log('🔑 [UUID TRACKING] Claim submission using fileKey:', claimData.fileKey);
      console.log('🔑 [UUID VERIFICATION] fileKey matches backend response:', claimData.fileKey === backendFileKey);
      
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
      console.error('💥 [UPLOAD ERROR] S3 upload error:', error);
      
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