// src/services/tasksService.js
import api from "./api";

// GET /api/tasks
export async function getMyTasks() {
  const response = await api.get("/api/tasks");
  return response.data; // List<TaskResponseDTO>
}

// GET /api/tasks/{id}
export async function getTaskById(id) {
  const response = await api.get(`/api/tasks/${id}`);
  return response.data; // TaskResponseDTO
}

// POST /api/tasks
export async function createTask(task) {
  // task: { title, description, status, dueDate }
  const response = await api.post("/api/tasks", task);
  return response.data;
}

// PUT /api/tasks/{id}
export async function updateTask(id, task) {
  const response = await api.put(`/api/tasks/${id}`, task);
  return response.data;
}

// DELETE /api/tasks/{id}
export async function deleteTask(id) {
  await api.delete(`/api/tasks/${id}`);
}
