/**
 * Backend API base URL.
 * Override with VITE_API_URL in .env / .env.development / Vercel env vars.
 */
const DEFAULT_API_URL = import.meta.env.PROD
  ? "https://uat-api.miraista.com/api"
  : "https://uat-api.miraista.com/api";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || DEFAULT_API_URL
).replace(/\/$/, "");

export const speechTtsUrl = `${API_BASE_URL}/speech/tts`;
export const speechSttUrl = `${API_BASE_URL}/speech/stt`;
export const chatUrl = `${API_BASE_URL}/chat`;

if (import.meta.env.DEV) {
  console.info("[API] Backend base URL:", API_BASE_URL);
}
