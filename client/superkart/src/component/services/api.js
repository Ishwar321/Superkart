import axios from "axios";
import { logoutUser } from "./AuthService";

// Use environment variable for API base URL, fallback to localhost for development
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const privateApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Dedicated API instance for file uploads
export const fileUploadApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000, // Longer timeout for file uploads
  headers: {
    'Accept': 'application/json'
    // Don't set Content-Type for multipart/form-data - let browser set it with boundary
  }
});

const refreshToken = async () => {
  try {
    const response = await api.post("/auth/refresh-token");
    return response.data.accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return Promise.reject(error);
  }
};

// Request interceptor for adding auth token
privateApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("authToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Add request timestamp for debugging
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
privateApi.interceptors.response.use(
  (response) => {
    // Log successful responses in debug mode
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log(`🟢 API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log errors in debug mode
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.error(`🔴 API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, error.response?.status);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        localStorage.setItem("authToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return privateApi(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed, logging out user");
        logoutUser();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Add interceptors for file upload API
fileUploadApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("authToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log(`🔵 File Upload Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error("File upload request interceptor error:", error);
    return Promise.reject(error);
  }
);

fileUploadApi.interceptors.response.use(
  (response) => {
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log(`🟢 File Upload Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.error(`🔴 File Upload Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, error.response?.status);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        localStorage.setItem("authToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return fileUploadApi(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed during file upload, logging out user");
        logoutUser();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Add response interceptor for general API
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log(`🟢 Public API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.error(`🔴 Public API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.status);
    }
    return Promise.reject(error);
  }
);

export default { api, privateApi, fileUploadApi };
