import axios from "axios";

// Define the base URL as a constant
export const BASE_URL = "http://localhost:5000/api/v1";

// Create axios instance with base URL
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response && error.response.status === 401) {
      // Just clear the auth data, let components handle redirects
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    // Create a more detailed error object
    const enhancedError = {
      ...error,
      message: error.response?.data?.error || error.message,
      status: error.response?.status,
      isServerError: !!error.response,
    };

    return Promise.reject(enhancedError);
  }
);

export default API;
