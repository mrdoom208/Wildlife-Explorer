const API_BASE_URL = import.meta.env.VITE_API_URL || ""; // <-- Added

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.ok ? response.json() : null;
};

// Users API wrapper
export const usersApi = {
  getAll: () => apiCall("/users"),
  create: (userData) =>
    apiCall("/users/add", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  update: (userId, userData) =>
    apiCall(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
  delete: (userId) => apiCall(`/users/${userId}`, { method: "DELETE" }),
};