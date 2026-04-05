// Automatically use the live Render URL in Vercel, and localhost for local development
export const BASE_URL = import.meta.env.PROD 
  ? "https://alphafit-updated.onrender.com/api" 
  : "http://localhost:8000/api";

export const API_PATHS = {
  AUTH: {
    GET_PROFILE: "/api/auth/profile",
  },
  USER: {
    // Save or update the authenticated user's fitness profile
    SAVE_FITNESS_PROFILE: "/api/user/fitness-profile",
    // Fetch the authenticated user's fitness profile (for prefill/edit flows)
    GET_FITNESS_PROFILE: "/api/user/fitness-profile",
  },
  PROFILE: {
    GET_FITNESS: "/api/profile/fitness",
    CREATE_FITNESS: "/api/profile/fitness",   // added for creating new fitness profile changes
    UPDATE_FITNESS: "/api/profile/fitness",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};
