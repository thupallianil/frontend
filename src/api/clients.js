import api from "./api.js";

// ============================================================
// GET ALL CLIENTS
// ============================================================

export async function getClients(params = {}) {
  const response = await api.get("clients/", { params });
  return response.data?.data ?? response.data;
}

// ============================================================
// GET ONE CLIENT
// ============================================================

export async function getClient(id) {
  if (!id) throw new Error("Client ID is required.");
  const response = await api.get(`clients/${id}/`);
  return response.data?.data ?? response.data;
}

// ============================================================
// CREATE CLIENT
// ============================================================

export async function createClient(data) {
  const response = await api.post("clients/", data);
  return response.data?.data ?? response.data;
}

// ============================================================
// UPDATE CLIENT
// ============================================================

export async function updateClient(id, data) {
  if (!id) throw new Error("Client ID is required.");
  const response = await api.patch(`clients/${id}/`, data);
  return response.data?.data ?? response.data;
}

// ============================================================
// DELETE CLIENT
// ============================================================

export async function deleteClient(id) {
  if (!id) throw new Error("Client ID is required.");
  const response = await api.delete(`clients/${id}/`);
  return response.data;
}

export default {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
};
