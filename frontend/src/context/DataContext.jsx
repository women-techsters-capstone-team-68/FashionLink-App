import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth }                   from "./AuthContext.jsx";
import { ordersApi, clientsApi }     from "../services/api.js";
import { getOrders, saveOrders, getClients, saveClients, generateId } from "../services/store.js";

const DataContext = createContext(null);

/* ── Normalise API order → internal shape ────────────────────── */
function normaliseOrder(raw) {
  const status = raw.status ?? "pending";
  const capitalised = status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
  return {
    id:           raw.order_number ?? String(raw.id),
    apiId:        raw.id ?? null,
    clientId:     raw.ClientId ?? raw.clientId ?? null,
    client:       raw.client?.fullName ?? raw.client?.name ?? raw.clientName ?? "",
    description:  raw.description ?? "",
    notes:        raw.notes ?? "",
    delivery:     raw.delivery_date
                    ? new Date(raw.delivery_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "",
    deliveryDate: raw.delivery_date ?? "",
    placedDate:   raw.createdAt ?? "",
    status:       capitalised,
    image:        raw.styleReferenceImageUrl ?? null,
    measurements: {
      chest:    raw.chest    ?? "",
      waist:    raw.waist    ?? "",
      hip:      raw.hip      ?? "",
      shoulder: raw.shoulder ?? "",
      sleeve:   raw.sleeve   ?? "",
      length:   raw.length   ?? "",
    },
  };
}

/* ── Normalise API client → internal shape ───────────────────── */
function normaliseClient(raw) {
  return {
    id:             String(raw.id),
    apiId:          raw.id ?? null,
    clientId:       raw.clientId ?? `CLT-${String(raw.id).padStart(3, "0")}`,
    name:           raw.name  ?? "",
    email:          raw.email ?? "",
    phone:          raw.phone ?? "",
    lastOrder:      raw.lastOrder ?? "",
    lastOrderShort: raw.lastOrderShort ?? "",
    measurements:   raw.measurements ?? {},
  };
}

/* ══════════════════════════════════════════════════════════════ */
export function DataProvider({ children }) {
  const { user } = useAuth();
  const userId   = user?.id ?? user?.email ?? null;

  const [orders,         setOrders]         = useState([]);
  const [clients,        setClients]        = useState([]);
  const [loadingOrders,  setLoadingOrders]  = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);

  /* ── Derive live order count per client ──────────────────────
   * This is the ONLY correct source for orderCount.
   * Never rely on a stored number — always compute from the array.
   */
  const clientsWithOrderCount = useMemo(() => {
    return clients.map((c) => ({
      ...c,
      orderCount: orders.filter(
        (o) => o.clientId === c.id || o.clientId === c.apiId
      ).length,
    }));
  }, [clients, orders]);

  /* ── Load orders ───────────────────────────────────────────── */
  const refreshOrders = useCallback(async () => {
    if (!userId) { setOrders([]); return; }
    const cached = getOrders(userId);
    setOrders(cached);
    setLoadingOrders(true);
    const { data, error } = await ordersApi.list();
    setLoadingOrders(false);
    if (!error && Array.isArray(data)) {
      const normalised = data.map(normaliseOrder);
      setOrders(normalised);
      saveOrders(userId, normalised);
    }
  }, [userId]);

  /* ── Load clients ──────────────────────────────────────────── */
  const refreshClients = useCallback(async () => {
    if (!userId) { setClients([]); return; }
    const cached = getClients(userId);
    setClients(cached);
    setLoadingClients(true);
    const { data, error } = await clientsApi.list();
    setLoadingClients(false);
    if (!error && Array.isArray(data)) {
      const normalised = data.map(normaliseClient);
      setClients(normalised);
      saveClients(userId, normalised);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) { refreshOrders(); refreshClients(); }
    else        { setOrders([]);   setClients([]);   }
  }, [userId, refreshOrders, refreshClients]);

  /* ════════════════════════════════════════════════════════════
     ORDERS CRUD
  ════════════════════════════════════════════════════════════ */
  const addOrder = async (formData) => {
    const localId    = generateId("ORD");
    const clientId   = formData.clientId ?? null;     // always the local client id
    const optimistic = {
      id:           localId,
      apiId:        null,
      clientId,
      client:       formData.clientName ?? "",
      description:  formData.description ?? "",
      notes:        formData.notes ?? "",
      delivery:     formData.deliveryDate
                      ? new Date(formData.deliveryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "",
      deliveryDate: formData.deliveryDate ?? "",
      placedDate:   new Date().toISOString(),
      status:       "Pending",
      image:        formData.image ?? null,
      measurements: {
        chest: formData.chest ?? "", waist: formData.waist ?? "",
        hip:   formData.hip   ?? "", shoulder: formData.shoulder ?? "",
        sleeve: formData.sleeve ?? "", length: formData.length ?? "",
      },
    };

    const next = [optimistic, ...orders];
    setOrders(next);
    saveOrders(userId, next);

    // Try API (best-effort)
    const apiBody = {
      clientId:     formData.apiClientId ?? formData.clientId,
      deliveryDate: formData.deliveryDate,
      description:  formData.description,
      notes:        formData.notes,
      chest:        formData.chest    ? Number(formData.chest)    : undefined,
      waist:        formData.waist    ? Number(formData.waist)    : undefined,
      hip:          formData.hip      ? Number(formData.hip)      : undefined,
      shoulder:     formData.shoulder ? Number(formData.shoulder) : undefined,
      sleeve:       formData.sleeve   ? Number(formData.sleeve)   : undefined,
      length:       formData.length   ? Number(formData.length)   : undefined,
    };
    const { data, error } = await ordersApi.create(apiBody);
    if (!error && data) {
      const real    = normaliseOrder(data);
      // Keep the local clientId so the profile page can still match it
      real.clientId = clientId;
      const updated = next.map((o) => (o.id === localId ? real : o));
      setOrders(updated);
      saveOrders(userId, updated);
      return { ok: true, order: real };
    }
    return { ok: true, order: optimistic };
  };

  const updateOrder = async (id, patch) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return { ok: false, error: "Order not found" };
    const updated = { ...order, ...patch };
    if (patch.deliveryDate) {
      updated.delivery = new Date(patch.deliveryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    const next = orders.map((o) => (o.id === id ? updated : o));
    setOrders(next);
    saveOrders(userId, next);
    if (order.apiId) {
      const apiPatch = {};
      if (patch.status)       apiPatch.status        = patch.status.toLowerCase().replace(/ /g, "_");
      if (patch.deliveryDate) apiPatch.delivery_date = patch.deliveryDate;
      if (patch.notes !== undefined) apiPatch.notes  = patch.notes;
      await ordersApi.update(order.apiId, apiPatch);
    }
    return { ok: true, order: updated };
  };

  const deleteOrder = async (id) => {
    const order = orders.find((o) => o.id === id);
    const next  = orders.filter((o) => o.id !== id);
    setOrders(next);
    saveOrders(userId, next);
    if (order?.apiId) await ordersApi.delete(order.apiId);
    return { ok: true };
  };

  /* ════════════════════════════════════════════════════════════
     CLIENTS CRUD
  ════════════════════════════════════════════════════════════ */
  const addClient = async (formData) => {
    const localId  = generateId("cli");
    const clientId = `CLT-${String(clients.length + 1).padStart(3, "0")}`;
    const optimistic = {
      id:             localId,
      apiId:          null,
      clientId,
      name:           formData.name  ?? "",
      email:          formData.email ?? "",
      phone:          formData.phone ?? "",
      lastOrder:      "",
      lastOrderShort: "",
      measurements:   formData.measurements ?? {},
    };
    const next = [optimistic, ...clients];
    setClients(next);
    saveClients(userId, next);

    const { data, error } = await clientsApi.create({
      name:         formData.name,
      email:        formData.email,
      measurements: formData.measurements ?? {},
    });
    if (!error && data?.client) {
      const real    = normaliseClient(data.client);
      real.measurements = optimistic.measurements; // preserve local measurements
      const updated = next.map((c) => (c.id === localId ? real : c));
      setClients(updated);
      saveClients(userId, updated);
      return { ok: true, client: real };
    }
    return { ok: true, client: optimistic };
  };

  const updateClient = async (id, patch) => {
    const client = clients.find((c) => c.id === id);
    if (!client) return { ok: false, error: "Client not found" };
    // Deep-merge measurements so partial updates don't wipe existing keys
    const merged = { ...client, ...patch };
    if (patch.measurements) {
      merged.measurements = { ...client.measurements, ...patch.measurements };
    }
    const next = clients.map((c) => (c.id === id ? merged : c));
    setClients(next);
    saveClients(userId, next);
    if (client.apiId) await clientsApi.update(client.apiId, patch);
    return { ok: true, client: merged };
  };

  const deleteClient = async (id) => {
    const client = clients.find((c) => c.id === id);
    // Also remove orders belonging to this client
    const updatedOrders = orders.filter((o) => o.clientId !== id && o.clientId !== client?.apiId);
    setClients(clients.filter((c) => c.id !== id));
    setOrders(updatedOrders);
    saveClients(userId, clients.filter((c) => c.id !== id));
    saveOrders(userId, updatedOrders);
    if (client?.apiId) await clientsApi.delete(client.apiId);
    return { ok: true };
  };

  return (
    <DataContext.Provider value={{
      orders,
      clients: clientsWithOrderCount,   // always has live orderCount
      loadingOrders,
      loadingClients,
      refreshOrders,
      refreshClients,
      addOrder,    updateOrder,    deleteOrder,
      addClient,   updateClient,   deleteClient,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}
