# S3 Direct Upload Implementation

## Overview

This implementation replaces the traditional file upload flow with a direct S3 upload using pre-signed URLs. This approach:

- ✅ Avoids sending large files to your backend server
- ✅ Reduces server bandwidth and storage usage
- ✅ Improves upload performance
- ✅ Provides better scalability

## Flow

### 1. Get Pre-signed URL
```javascript
// Frontend requests upload URL from backend
const uploadUrlResponse = await claimService.getUploadUrl(fileName, contentType);
```

**Backend Response:**
```json
{
  "presignedUrl": "https://claim-motor.s3.ap-south-1.amazonaws.com/uploads/...",
  "fileKey": "uploads/6f90b9dd-cb39-4924-9e9f-a5fb4b914744.jpg",
  "s3Url": "https://claim-motor.s3.amazonaws.com/uploads/6f90b9dd-cb39-4924-9e9f-a5fb4b914744.jpg",
  "expirationTime": 1751654140745
}
```

### 2. Upload to S3
```javascript
// Frontend uploads directly to S3 using pre-signed URL
await claimService.uploadToS3(presignedUrl, file);
```

### 3. Submit Claim Data
```javascript
// Frontend sends claim data with S3 image URL
const claimData = {
  carMake: "Toyota",
  carModel: "Swift",
  imageUrl: "https://claim-motor.s3.amazonaws.com/uploads/...",
  fileKey: "uploads/6f90b9dd-cb39-4924-9e9f-a5fb4b914744.jpg"
};
await claimService.submitClaim(claimData);
```

## Implementation Details

### New Files Created
- `src/hooks/useS3Upload.js` - Custom hook for S3 upload flow
- `S3_UPLOAD_IMPLEMENTATION.md` - This documentation

### Modified Files
- `src/services/api/claimService.js` - Added S3 upload methods
- `src/pages/ClaimUpload.jsx` - Updated to use S3 upload flow
- `src/components/claims/ClaimUploadForm.jsx` - Updated status messages

### Key Features

1. **Progress Tracking**: Real-time upload progress with descriptive messages
2. **Error Handling**: Comprehensive error handling for each step
3. **Validation**: Validates pre-signed URL response before proceeding
4. **Clean Separation**: Upload logic separated into reusable hook
5. **React StrictMode Protection**: Handles double execution in development

### Backend Requirements

Your Java backend needs to implement:

1. **GET Upload URL Endpoint**: `POST /api/get-upload-url`
   - Headers: `Content-Type: application/x-www-form-urlencoded`
   - Body: `fileName=car-damage.jpg&contentType=image/jpeg`
   - Returns: Pre-signed URL and S3 metadata

2. **S3 Upload Endpoint**: `POST /api/s3upload`
   - Headers: `Content-Type: application/json`
   - Body: JSON with `carMake`, `carModel`, `imageUrl`, `fileKey`
   - No longer accepts file uploads

### Testing

To test the implementation:

1. Ensure your backend `POST /api/get-upload-url` endpoint is working
2. Upload a claim image through the frontend
3. Verify the file appears in your S3 bucket
4. Check that claim processing works with the S3 image URL

### Example cURL Commands

**Get Pre-signed URL:**
```bash
curl -X POST http://localhost:8080/api/get-upload-url \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "fileName=car-damage.jpg&contentType=image/jpeg"
```

**Submit Claim:**
```bash
curl -X POST http://localhost:8080/api/s3upload \
  -H "Content-Type: application/json" \
  -d '{
    "carMake": "Toyota",
    "carModel": "Swift",
    "imageUrl": "https://claim-motor.s3.ap-south-1.amazonaws.com/uploads/6f90b9dd-cb39-4924-9e9f-a5fb4b914744.jpg",
    "fileKey": "uploads/6f90b9dd-cb39-4924-9e9f-a5fb4b914744.jpg"
  }'
```

### Benefits

- **Performance**: Faster uploads (direct to S3)
- **Scalability**: Reduced server load
- **Cost**: Lower bandwidth costs for your server
- **Reliability**: S3's high availability and durability
- **Security**: Pre-signed URLs with expiration times

### React StrictMode Handling

The implementation includes protection against React StrictMode's double execution:

1. **Request Deduplication**: Uses a Map to track active requests
2. **Promise Sharing**: Multiple calls share the same request promise
3. **Unique Request IDs**: Prevents duplicate executions
4. **State Protection**: Uses refs to prevent race conditions

### Debugging

The implementation includes comprehensive logging:

- Request initiation and completion
- Upload progress tracking
- Error handling and recovery
- Duplicate request detection

This ensures easy debugging and monitoring of the upload process. 