/**
 * api.js — Thin fetch wrapper for the Fashion Link backend.
 *
 * Base URL : https://fashion-link-m2y7.onrender.com
 * Auth     : Bearer token from localStorage "fl_token"
 *
 * Every exported function returns { data, error }.
 * Caller never needs to try/catch — network errors are caught here.
 */
import { getToken } from "../context/AuthContext.jsx";

const BASE = "https://fashion-link-m2y7.onrender.com";

async function request(method, path, body) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { data: null, error: data.message ?? `HTTP ${res.status}` };
    return { data, error: null };
  } catch {
    return { data: null, error: "Network error — check your connection." };
  }
}

/* ── Orders (backend-supported) ─────────────────────────────── */
export const ordersApi = {
  list:   (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request("GET", `/api/orders${qs ? "?" + qs : ""}`);
  },
  get:    (id)           => request("GET",    `/api/orders/${id}`),
  create: (body)         => request("POST",   "/api/orders", body),
  update: (id, body)     => request("PATCH",  `/api/orders/${id}`, body),
  delete: (id)           => request("DELETE", `/api/orders/${id}`),
};

/* ── Clients (backend-supported) ────────────────────────────── */
export const clientsApi = {
  list:   ()         => request("GET",    "/api/clients"),
  get:    (id)       => request("GET",    `/api/clients/${id}`),
  create: (body)     => request("POST",   "/api/clients", body),
  update: (id, body) => request("PATCH",  `/api/clients/${id}`, body),
  delete: (id)       => request("DELETE", `/api/clients/${id}`),
};
