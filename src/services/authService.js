// src/services/authService.js
import api from "./api";

// POST /api/auth/login
export async function login(username, password) {
  const response = await api.post("/api/auth/login", {
    username,
    password,
  });

  const data = response.data;

  // Guardar token + info básica
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("tokenType", data.tokenType); // "Bearer"
  localStorage.setItem("username", data.username);
  localStorage.setItem("email", data.email);
  localStorage.setItem("roles", JSON.stringify(data.roles || []));

  return data;
}


export async function register(username, email, password) {
  const response = await api.post("/api/auth/register", {
    username,
    email,
    password,
  });

  const data = response.data;

  
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("tokenType", data.tokenType);
    localStorage.setItem("username", data.username);
    localStorage.setItem("email", data.email);
    localStorage.setItem("roles", JSON.stringify(data.roles || []));
  }

  return data;
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("tokenType");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("roles");
}

export function isLoggedIn() {
  return !!localStorage.getItem("accessToken");
}

export function getStoredUser() {
  return {
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    roles: JSON.parse(localStorage.getItem("roles") || "[]"),
  };
}
