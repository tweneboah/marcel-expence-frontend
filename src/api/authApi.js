import API from "./apiConfig";

// Register user
export const register = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await API.post("/auth/login", credentials);

  // Store token and user data in localStorage
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

// Logout user
export const logout = async () => {
  const response = await API.get("/auth/logout");

  // Remove token and user data from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};
