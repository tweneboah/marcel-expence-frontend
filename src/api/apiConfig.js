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
    console.log(`API Request to ${config.url}`, {
      hasToken: !!token,
      tokenFirstChars: token ? `${token.substring(0, 10)}...` : "none",
      method: config.method,
      headers: config.headers,
    });

    if (token) {
      // Make sure token is properly formatted - some APIs expect exactly "Bearer TOKEN"
      // with proper spacing, while others might have different requirements
      const formattedToken = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
      config.headers["Authorization"] = formattedToken;

      console.log(
        "Authorization header set:",
        formattedToken.substring(0, 15) + "..."
      );
    } else {
      console.warn("No authentication token found in localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
API.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`API Response success from ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText,
      dataPreview: response.data
        ? JSON.stringify(response.data).substring(0, 100) + "..."
        : "No data",
    });
    return response;
  },
  (error) => {
    console.error(`API Error for ${error.config?.url || "unknown endpoint"}:`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    // Handle specific error cases
    if (error.response && error.response.status === 401) {
      console.error(
        "Unauthorized access (401). Token may be invalid or expired."
      );
      // Just clear the auth data, let components handle redirects
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    // Create a more detailed error object
    const enhancedError = {
      ...error,
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
      status: error.response?.status,
      isServerError: !!error.response,
    };

    return Promise.reject(enhancedError);
  }
);

export default API;
