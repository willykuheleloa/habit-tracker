const API_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
};

export const loginUser = (userData) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const registerUser = (userData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const getHabits = () => apiRequest("/habits");

export const createHabitRequest = (habitData) => {
  return apiRequest("/habits", {
    method: "POST",
    body: JSON.stringify(habitData),
  });
};

export const completeHabitRequest = (id) => {
  return apiRequest(`/habits/${id}/complete`, {
    method: "PATCH",
  });
};

export const deleteHabitRequest = (id) => {
  return apiRequest(`/habits/${id}`, {
    method: "DELETE",
  });
};

export const getAnalytics = () => apiRequest("/analytics");
