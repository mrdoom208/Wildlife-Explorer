const API_BASE_URL = "http://localhost:5000";

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

export const usersApi = {
  getAll: () => apiCall("/admin/users"),
  create: (userData) =>
    apiCall("/admin/users/add", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  update: (userId, userData) =>
    apiCall(`/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
  delete: (userId) => apiCall(`/admin/users/${userId}`, { method: "DELETE" }),
};
