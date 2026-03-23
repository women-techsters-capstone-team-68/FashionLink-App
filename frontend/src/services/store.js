/**
 * store.js — Per-user localStorage store.
 *
 * Key pattern: fl:<userId>:<collection>
 *
 * SHARED KEYS (cross-user):
 *   fl:global:registeredClients   → clients who signed up via client portal
 *   fl:global:sharedOrders        → orders indexed by clientEmail for cross-portal linking
 */

/* ── Helpers ─────────────────────────────────────────────────── */
function key(userId, collection) { return `fl:${userId}:${collection}`; }

function read(k) {
  try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch { return null; }
}

function write(k, value) {
  try { localStorage.setItem(k, JSON.stringify(value)); } catch {}
}

/* ── Orders (artisan's own) ──────────────────────────────────── */
export function getOrders(userId) { return read(key(userId, "orders")) ?? []; }
export function saveOrders(userId, orders) { write(key(userId, "orders"), orders); }

/* ── Clients (artisan's own) ─────────────────────────────────── */
export function getClients(userId) { return read(key(userId, "clients")) ?? []; }
export function saveClients(userId, clients) { write(key(userId, "clients"), clients); }

/* ── Clear user store on logout ──────────────────────────────── */
export function clearUserStore(userId) {
  ["orders", "clients"].forEach((col) => localStorage.removeItem(key(userId, col)));
}

/* ── Unique ID generator ─────────────────────────────────────── */
export function generateId(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

/* ── Client Measurements (per client user, keyed by their userId) */
export function getMeasurements(userId) { return read(key(userId, "measurements")) ?? {}; }
export function saveMeasurements(userId, m) { write(key(userId, "measurements"), m); }

/* ── Client Profile (name, phone, gender, avatar) ────────────── */
export function getClientProfile(userId) { return read(key(userId, "clientProfile")) ?? null; }
export function saveClientProfile(userId, profile) { write(key(userId, "clientProfile"), profile); }

/* ── Client Orders (cross-portal: written by artisan, read by client) ── */
export function getClientOrders(clientEmail) {
  return read(`fl:client:${clientEmail}:orders`) ?? [];
}
export function saveClientOrders(clientEmail, orders) {
  write(`fl:client:${clientEmail}:orders`, orders);
}

/**
 * pushOrderToClient — called by artisan when creating/updating an order.
 * Appends or replaces the order in the client's order bucket, keyed by email.
 * This is how client portal sees artisan-created orders.
 */
export function pushOrderToClient(clientEmail, order) {
  if (!clientEmail) return;
  const existing = getClientOrders(clientEmail);
  const idx = existing.findIndex((o) => o.id === order.id);
  if (idx >= 0) existing[idx] = order;
  else existing.unshift(order);
  saveClientOrders(clientEmail, existing);
}

/**
 * removeOrderFromClient — called by artisan when deleting an order.
 */
export function removeOrderFromClient(clientEmail, orderId) {
  if (!clientEmail) return;
  const filtered = getClientOrders(clientEmail).filter((o) => o.id !== orderId);
  saveClientOrders(clientEmail, filtered);
}

/* ── Global registered clients registry ──────────────────────
 * When a client signs up, their {id, email, fullName, phone} is
 * stored here so artisans can search and autofill from real accounts.
 */
export function getRegisteredClients() {
  return read("fl:global:registeredClients") ?? [];
}

export function registerClient(clientData) {
  const all = getRegisteredClients();
  const idx = all.findIndex((c) => c.email === clientData.email);
  if (idx >= 0) all[idx] = { ...all[idx], ...clientData };
  else all.push(clientData);
  write("fl:global:registeredClients", all);
}

export function findRegisteredClient(email) {
  return getRegisteredClients().find((c) => c.email === email) ?? null;
}
