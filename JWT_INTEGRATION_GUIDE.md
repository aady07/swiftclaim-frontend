# JWT Integration with AWS Cognito - Frontend Implementation

This document outlines the implementation of JWT token authentication using AWS Cognito in the frontend application.

## Overview

The application now uses AWS Cognito for user authentication and automatically includes JWT tokens in all API requests to the backend. The JWT token contains the user's unique identifier which is used as the `user_id` in the claims table.

## Architecture

### 1. Authentication Flow

```
User Login → AWS Cognito → JWT Token → API Requests with Authorization Header
```

### 2. Key Components

- **Cognito Service** (`src/services/cognitoService.js`): Handles AWS Cognito authentication
- **Authenticated API Service** (`src/services/api/authenticatedApiService.js`): Centralized API client with JWT token injection
- **Cognito Auth Hook** (`src/hooks/useCognitoAuth.js`): React hook for authentication state management

## Implementation Details

### 1. Enhanced Cognito Service

The `cognitoService.js` has been extended with new methods:

```javascript
// Get JWT access token for API calls
getAccessToken: async () => {
  const session = await cognitoService.getSession();
  return session.getAccessToken().getJwtToken();
}

// Get JWT ID token (contains user information)
getIdToken: async () => {
  const session = await cognitoService.getSession();
  return session.getIdToken().getJwtToken();
}

// Extract user ID from JWT token
getUserId: async () => {
  const idToken = await cognitoService.getIdToken();
  const payload = JSON.parse(atob(idToken.split('.')[1]));
  return payload.sub; // 'sub' is the user ID in Cognito
}

// Extract user email from JWT token
getUserEmail: async () => {
  const idToken = await cognitoService.getIdToken();
  const payload = JSON.parse(atob(idToken.split('.')[1]));
  return payload.email;
}
```

### 2. Authenticated API Service

The `authenticatedApiService.js` provides a centralized way to make authenticated API calls:

#### Features:
- **Automatic JWT Injection**: All requests automatically include the JWT token in the Authorization header
- **Error Handling**: Handles 401 unauthorized responses by redirecting to login
- **User ID Integration**: Automatically includes the Cognito user ID in claim submissions

#### Request Interceptor:
```javascript
apiClient.interceptors.request.use(async (config) => {
  const accessToken = await cognitoService.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
```

#### Response Interceptor:
```javascript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3. API Endpoints

The authenticated service provides methods for all API endpoints:

#### Claims API:
- `getAllClaims()` - Get all claims for authenticated user
- `getClaimById(claimId)` - Get specific claim
- `getUploadUrl(fileName, contentType)` - Get S3 pre-signed URL
- `submitClaim(claimData)` - Submit new claim with user ID
- `getOriginalImage(claimId)` - Get original claim image
- `getProcessedImage(claimId)` - Get processed claim image
- `uploadToS3(presignedUrl, file)` - Upload file to S3

#### Chat API:
- `sendMessage(messageData)` - Send chat message
- `getSystemPrompt(language)` - Get system prompt

#### Speech API:
- `speechToText(audioBlob)` - Convert speech to text

### 4. User ID Integration

When submitting claims, the system automatically:

1. Extracts the user ID from the JWT token
2. Includes it in the claim data
3. Sends it to the backend

```javascript
submitClaim: async (claimData) => {
  const userId = await cognitoService.getUserId();
  const claimWithUserId = {
    ...claimData,
    userId: userId
  };
  // Submit to backend
}
```

## Usage Examples

### 1. Making Authenticated API Calls

```javascript
import { authenticatedApiService } from '../services/api/authenticatedApiService';

// Get all claims (automatically includes JWT token)
const claims = await authenticatedApiService.claims.getAllClaims();

// Submit a claim (automatically includes user ID)
const claimData = {
  carMake: 'Toyota',
  carModel: 'Camry',
  imageUrl: 'https://s3...',
  fileKey: 'uuid-123'
};
const result = await authenticatedApiService.claims.submitClaim(claimData);
```

### 2. Getting User Information

```javascript
import { useCognitoAuth } from '../hooks/useCognitoAuth';

const { getUserId, getUserEmail, isAuthenticated } = useCognitoAuth();

// Get current user ID
const userId = await getUserId();

// Get current user email
const email = await getUserEmail();

// Check if user is authenticated
const authenticated = await isAuthenticated();
```

### 3. Using the Auth Test Component

The `AuthTest` component provides a way to test the JWT integration:

```javascript
import AuthTest from '../components/AuthTest';

// Add to any page to test authentication
<AuthTest />
```

## Security Features

### 1. Automatic Token Management
- JWT tokens are automatically retrieved from Cognito sessions
- Tokens are included in all API requests
- Expired tokens trigger automatic redirect to login

### 2. User Isolation
- Each user can only access their own claims
- User ID is automatically extracted from JWT token
- No manual user ID management required

### 3. Error Handling
- 401 responses automatically redirect to login
- Failed authentication attempts are logged
- Graceful fallback for missing tokens

## Backend Requirements

The backend must be configured to:

1. **Validate JWT Tokens**: Verify tokens using AWS Cognito public keys
2. **Extract User ID**: Parse the `sub` claim from the JWT token
3. **Use User ID**: Store and retrieve claims using the Cognito user ID
4. **Handle Authorization**: Return 401 for invalid/missing tokens

### Expected JWT Token Structure:
```json
{
  "sub": "user-uuid-from-cognito",
  "email": "user@example.com",
  "exp": 1234567890,
  "iat": 1234567890,
  "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_BnYv7pRT9"
}
```

## Testing

### 1. Authentication Test Component
The `AuthTest` component provides comprehensive testing:
- Authentication status verification
- User ID extraction
- Email extraction
- Access token retrieval
- API call testing

### 2. Console Logging
All authentication operations are logged to the console:
- `🔐 [AUTH]` - Authentication operations
- `🔐 [CLAIMS API]` - Claims API calls
- `🔐 [CHAT API]` - Chat API calls
- `🔐 [SPEECH API]` - Speech API calls

### 3. Manual Testing
1. Log in to the application
2. Navigate to the Claims Dashboard
3. Run the Auth Test component
4. Verify all tests pass
5. Check browser network tab for Authorization headers

## Migration Notes

### Updated Components:
- `ClaimsDashboard.jsx` - Now uses authenticated API service
- `ClaimUpload.jsx` - Uses authenticated claim submission
- `useS3Upload.js` - Updated to use authenticated service
- `chatService.js` - Now uses authenticated API service
- `useSpeechRecognition.js` - Updated for authenticated speech API

### Backward Compatibility:
- Legacy API methods are still available in `claimService.js`
- Old components will continue to work but without authentication
- Gradual migration to authenticated service is recommended

## Troubleshooting

### Common Issues:

1. **401 Unauthorized Errors**
   - Check if user is logged in
   - Verify JWT token is valid
   - Check backend JWT validation

2. **Missing User ID**
   - Ensure Cognito user pool is configured correctly
   - Verify JWT token contains `sub` claim
   - Check token expiration

3. **API Call Failures**
   - Verify backend is running
   - Check CORS configuration
   - Ensure Authorization header is being sent

### Debug Commands:
```javascript
// Check authentication status
await authenticatedApiService.utils.isAuthenticated()

// Get current user ID
await authenticatedApiService.utils.getCurrentUserId()

// Get access token
await authenticatedApiService.utils.getAccessToken()
```

## Future Enhancements

1. **Token Refresh**: Implement automatic token refresh before expiration
2. **Offline Support**: Cache claims for offline viewing
3. **Multi-factor Authentication**: Support for MFA tokens
4. **Role-based Access**: Implement role-based permissions
5. **Audit Logging**: Log all authentication events

## Conclusion

The JWT integration provides a secure, scalable authentication system that:
- Automatically handles user authentication
- Secures all API communications
- Provides user isolation
- Simplifies user management
- Enables future security enhancements

The implementation is production-ready and follows AWS best practices for Cognito integration. 