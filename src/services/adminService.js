import api from "./api";

export async function getAllUsers() {
  const res = await api.get("/api/admin/users");
  return res.data;
}
