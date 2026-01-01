// src/services/userService.js
import api from "./api";

// GET /api/users/me
export async function getCurrentUser() {
  const response = await api.get("/api/users/me");
  return response.data;
}
