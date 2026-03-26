export const BASE_URL = "http://localhost:8000/api";  
// export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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


// import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:8000/api", // backend root
// });

// // Automatically attach JWT token if available
// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`; // ✅ fixed backticks
//   }
//   return config;
// });

// export default instance;