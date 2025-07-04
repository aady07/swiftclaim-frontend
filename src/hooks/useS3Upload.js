import { useState, useRef } from 'react';
import { claimService } from '../services/api/claimService';

export const useS3Upload = () => {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const uploadRef = useRef(null);
  const requestIdRef = useRef(null);

  const uploadFileToS3 = async (file, carMake, carModel) => {
    // Generate unique request ID to prevent React StrictMode double execution
    const requestId = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;
    
    // Prevent multiple simultaneous uploads with ref
    if (uploadRef.current) {
      console.log('Upload already in progress, ignoring duplicate call');
      return;
    }

    // Prevent duplicate requests with same request ID
    if (requestIdRef.current === requestId) {
      console.log('Duplicate request ID detected, ignoring');
      return;
    }

    uploadRef.current = { file, carMake, carModel };
    requestIdRef.current = requestId;
    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      // Step 1: Get pre-signed URL (20% progress)
      setUploadProgress(20);
      console.log('Getting pre-signed URL for file:', file.name);
      const uploadUrlResponse = await claimService.getUploadUrl(
        file.name,
        file.type
      );

      console.log('Pre-signed URL response:', uploadUrlResponse);

      if (!uploadUrlResponse.presignedUrl || !uploadUrlResponse.s3Url) {
        throw new Error('Invalid upload URL response from server');
      }

      // Step 2: Upload file directly to S3 (60% progress)
      setUploadProgress(60);
      console.log('Uploading file to S3 with fileKey:', uploadUrlResponse.fileKey);
      await claimService.uploadToS3(uploadUrlResponse.presignedUrl, file);

      // Step 3: Submit claim data with S3 image URL (80% progress)
      setUploadProgress(80);
      const claimData = {
        carMake: carMake,
        carModel: carModel,
        imageUrl: uploadUrlResponse.s3Url,
        fileKey: uploadUrlResponse.fileKey
      };

      console.log('Submitting claim with data:', claimData);
      const data = await claimService.submitClaim(claimData);
      
      // Step 4: Complete (100% progress)
      setUploadProgress(100);
      setUploadStatus('success');
      
      return data;
    } catch (error) {
      console.error('S3 upload error:', error);
      setUploadStatus('error');
      setUploadProgress(0);
      throw error;
    } finally {
      setIsUploading(false);
      uploadRef.current = null;
      requestIdRef.current = null;
    }
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadProgress(0);
  };

  return {
    uploadFileToS3,
    uploadStatus,
    uploadProgress,
    resetUpload
  };
}; 