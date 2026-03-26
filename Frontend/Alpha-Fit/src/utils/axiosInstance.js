import axios from "axios";
import { BASE_URL } from "./apiPaths";

let accessToken = localStorage.getItem("token") || null;

export const setToken = (token) => {
  accessToken = token;
  localStorage.setItem("token", token);
};

export const clearToken = () => {
  accessToken = null;
  localStorage.removeItem("token");
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// axiosInstance.interceptors.request.use((config) => {
//   if (accessToken && !config.headers?.Authorization) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   console.log("TOKEN SENT:", token);

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && !error.config.url.includes("/auth")) {
      clearToken();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// import axios from "axios";
// import { BASE_URL } from "./apiPaths";

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
//   // If your backend uses cookies/sessions, uncomment:
//   // withCredentials: true,
// });

// // Request Interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem("token");
//     if (accessToken) {
//       // Don’t overwrite if already set by a specific call
//       if (!config.headers?.Authorization) {
//         config.headers = config.headers || {};
//         config.headers.Authorization = `Bearer ${accessToken}`; // fixed template literal
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response Interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       const { status } = error.response;
//       // removed: stray "text;" which causes ReferenceError
//       if (status === 401) {
//         try {
//           const current = window.location.pathname + window.location.search;
//           const next = encodeURIComponent(current);
//           window.location.href = `/login?next=${next}`;
//         } catch {
//           window.location.href = "/login";
//         }
//       } else if (status === 500) {
//         console.error("Server error. Please try again later.");
//       }
//     } else if (error.code === "ECONNABORTED") {
//       console.error("Request timeout. Please try again.");
//     } else if (error.request) {
//       console.error("Network error or no response from server.");
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

// import axios from "axios";
// import { BASE_URL } from "./apiPaths";

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // Request Interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem("token");
//     if (accessToken) {
//       // Only set if not already present
//       if (!config.headers.Authorization) {
//         config.headers.Authorization = "Bearer ${accessToken}";
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response Interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle common errors globally
//     if (error.response) {
//       const { status } = error.response;
//       if (status === 401) {
//         // Build a redirect that preserves current path
//         try {
//           const current = window.location.pathname + window.location.search;
//           const next = encodeURIComponent(current);
//           window.location.href = `/login?next=${next}`;
//         } catch {
//           window.location.href = "/login";
//         }
//       } else if (status === 500) {
//         console.error("Server error. Please try again later.");
//       }
//     } else if (error.code === "ECONNABORTED") {
//       console.error("Request timeout. Please try again.");
//     } else if (error.request) {
//       // No response received (e.g., CORS/Network error)
//       console.error("Network error or no response from server.");
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

// import axios, { AxiosHeaders } from "axios";
// import { BASE_URL } from "./apiPaths";

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 20000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       if (!(config.headers instanceof AxiosHeaders)) {
//         config.headers = new AxiosHeaders(config.headers);
//       }
//       config.headers.set("Authorization", `Bearer ${token}`);
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;

// utils/axiosInstance.js
// import axios, { AxiosHeaders } from "axios";
// import { BASE_URL } from "./apiPaths";

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // Request Interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem("token");
//     if (accessToken) {
//       // Normalize headers object to AxiosHeaders
//       if (!(config.headers instanceof AxiosHeaders)) {
//         config.headers = new AxiosHeaders(config.headers);
//       }
//       // Always set/overwrite Authorization for safety
//       config.headers.set("Authorization", `Bearer ${accessToken}`); // backticks fixed [8][7]
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response Interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       const { status } = error.response;
//       if (status === 401) {
//         try {
//           const current = window.location.pathname + window.location.search;
//           const next = encodeURIComponent(current);
//           window.location.href = `/login?next=${next}`;
//         } catch {
//           window.location.href = "/login";
//         }
//       } else if (status === 500) {
//         console.error("Server error. Please try again later.");
//       }
//     } else if (error.code === "ECONNABORTED") {
//       console.error("Request timeout. Please try again.");
//     } else if (error.request) {
//       console.error("Network error or no response from server.");
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
