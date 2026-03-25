// store.js — per-user localStorage with cross-portal order linking and global registries

function key(userId, col) { return `fl:${userId}:${col}`; }

function read(k) {
  try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch { return null; }
}

function write(k, value) {
  try { localStorage.setItem(k, JSON.stringify(value)); } catch {}
}

// Artisan orders (keyed by artisan userId)
export function getOrders(userId) { return read(key(userId, "orders")) ?? []; }
export function saveOrders(userId, orders) { write(key(userId, "orders"), orders); }

// Artisan clients
export function getClients(userId) { return read(key(userId, "clients")) ?? []; }
export function saveClients(userId, clients) { write(key(userId, "clients"), clients); }

export function clearUserStore(userId) {
  ["orders", "clients"].forEach((col) => localStorage.removeItem(key(userId, col)));
}

export function generateId(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

// Client measurements (keyed by client userId)
export function getMeasurements(userId) { return read(key(userId, "measurements")) ?? {}; }
export function saveMeasurements(userId, m) { write(key(userId, "measurements"), m); }

// Client profile
export function getClientProfile(userId) { return read(key(userId, "clientProfile")) ?? null; }
export function saveClientProfile(userId, profile) { write(key(userId, "clientProfile"), profile); }

// Cross-portal: artisan writes orders to client's email bucket
export function getClientOrders(clientEmail) {
  return read(`fl:client:${clientEmail}:orders`) ?? [];
}
export function saveClientOrders(clientEmail, orders) {
  write(`fl:client:${clientEmail}:orders`, orders);
}

export function pushOrderToClient(clientEmail, order) {
  if (!clientEmail) return;
  const existing = getClientOrders(clientEmail);
  const idx = existing.findIndex((o) => o.id === order.id);
  if (idx >= 0) existing[idx] = order;
  else existing.unshift(order);
  saveClientOrders(clientEmail, existing);
}

export function removeOrderFromClient(clientEmail, orderId) {
  if (!clientEmail) return;
  saveClientOrders(clientEmail, getClientOrders(clientEmail).filter((o) => o.id !== orderId));
}

// Global client registry — clients who signed up
export function getRegisteredClients() { return read("fl:global:registeredClients") ?? []; }

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

// Global artisan registry — artisans who signed up (for network merging)
export function getRegisteredArtisans() { return read("fl:global:registeredArtisans") ?? []; }

export function registerArtisan(artisanData) {
  if (!artisanData.id && !artisanData.email) return;
  const all = getRegisteredArtisans();
  const idx = all.findIndex((a) => a.id === artisanData.id || a.email === artisanData.email);
  if (idx >= 0) all[idx] = { ...all[idx], ...artisanData };
  else all.push(artisanData);
  write("fl:global:registeredArtisans", all);
}

export function getAllArtisans(mockArtisans) {
  const real = getRegisteredArtisans();
  const realIds = new Set(real.map((a) => a.id));
  // Merge: real users first, then mock artisans not already in real list
  return [...real, ...mockArtisans.filter((m) => !realIds.has(m.id))];
}
