// API Configuration
export const API_CONFIG = {
  // Backend URLs
  CLAIMS_API_BASE_URL: 'https://testing.aadybackend.site/api',
  CHAT_API_BASE_URL: 'https://aadybackend.site/api',
  
  // Environment-based URLs (fallback to production)
  getClaimsApiUrl: () => {
    return import.meta.env.VITE_CLAIMS_API_URL || API_CONFIG.CLAIMS_API_BASE_URL;
  },
  
  getChatApiUrl: () => {
    return import.meta.env.VITE_CHAT_API_URL || API_CONFIG.CHAT_API_BASE_URL;
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  // User tier endpoints
  USER_LIMIT_INFO: '/user/limit-info',
  USER_UPLOAD_LIMIT: '/user/upload-limit',
  USER_UPLOAD_STATS: '/user/upload-stats',
  USER_UPGRADE_TIER: '/user/upgrade-tier',
  
  // Claims endpoints
  CLAIMS: '/claims',
  CLAIM_BY_ID: (id) => `/claims/${id}`,
  CLAIM_RESULTS: (id) => `/claims/${id}/results`,
  CLAIM_ORIGINAL_IMAGE: (id) => `/claims/${id}/original-image`,
  CLAIM_MODEL1_IMAGE: (id) => `/claims/${id}/model1-image`,
  CLAIM_MODEL2_IMAGE: (id) => `/claims/${id}/model2-image`,
  GET_UPLOAD_URL: '/get-upload-url',
  S3_UPLOAD: '/s3upload',
  
  // Chat endpoints
  CHAT: '/chat',
  SPEECH_STT: '/speech/stt'
}; 