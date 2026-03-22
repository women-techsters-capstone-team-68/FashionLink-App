/**
 * store.js — Per-user localStorage store.
 *
 * Keys are namespaced by user ID so two users on the same browser
 * never see each other's data.
 *
 * Key pattern: fl:<userId>:<collection>
 *   e.g. "fl:3:orders"  "fl:3:clients"
 *
 * Public API (all functions are synchronous):
 *
 *   getOrders(userId)          → Order[]
 *   saveOrders(userId, orders) → void
 *
 *   getClients(userId)          → Client[]
 *   saveClients(userId, clients)→ void
 *
 *   clearUser(userId)           → void   (logout / data wipe)
 *
 * The store does NOT contain any static seed data.
 * A brand-new user always sees empty arrays.
 */

/* ── Helpers ─────────────────────────────────────────────────── */
function key(userId, collection) {
  return `fl:${userId}:${collection}`;
}

function read(k) {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(k, value) {
  try {
    localStorage.setItem(k, JSON.stringify(value));
  } catch {
    // localStorage full — silently skip (non-critical for demo)
  }
}

/* ── Orders ──────────────────────────────────────────────────── */
export function getOrders(userId) {
  return read(key(userId, "orders")) ?? [];
}

export function saveOrders(userId, orders) {
  write(key(userId, "orders"), orders);
}

/* ── Clients ─────────────────────────────────────────────────── */
export function getClients(userId) {
  return read(key(userId, "clients")) ?? [];
}

export function saveClients(userId, clients) {
  write(key(userId, "clients"), clients);
}

/* ── Wipe all data for a user (logout) ───────────────────────── */
export function clearUserStore(userId) {
  ["orders", "clients"].forEach((col) => {
    localStorage.removeItem(key(userId, col));
  });
}

/* ── Unique ID generator ─────────────────────────────────────── */
export function generateId(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

/* ── Client Measurements (per client user) ───────────────────── */
export function getMeasurements(userId) {
  return read(key(userId, "measurements")) ?? {};
}

export function saveMeasurements(userId, measurements) {
  write(key(userId, "measurements"), measurements);
}

/* ── Client Profile (name, phone, gender, avatar) ────────────── */
export function getClientProfile(userId) {
  return read(key(userId, "clientProfile")) ?? null;
}

export function saveClientProfile(userId, profile) {
  write(key(userId, "clientProfile"), profile);
}

/* ── Client Orders (from artisan side, visible to client) ──────── */
export function getClientOrders(userId) {
  return read(key(userId, "clientOrders")) ?? [];
}

export function saveClientOrders(userId, orders) {
  write(key(userId, "clientOrders"), orders);
}
