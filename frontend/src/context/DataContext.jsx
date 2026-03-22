import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth }    from "./AuthContext.jsx";
import { ordersApi, clientsApi } from "../services/api.js";
import {
  getOrders,  saveOrders,
  getClients, saveClients,
  generateId,
} from "../services/store.js";

const DataContext = createContext(null);

/* ── Normalise API order → internal shape ────────────────────── */
function normaliseOrder(raw) {
  return {
    // ids
    id:           raw.order_number ?? raw.id ?? String(raw.id),
    apiId:        raw.id,
    clientId:     raw.ClientId    ?? raw.clientId ?? null,
    // display fields
    client:       raw.client?.fullName ?? raw.client?.name ?? raw.clientName ?? "",
    description:  raw.description ?? "",
    notes:        raw.notes ?? "",
    delivery:     raw.delivery_date
                    ? new Date(raw.delivery_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "",
    deliveryDate: raw.delivery_date ?? "",
    placedDate:   raw.createdAt ?? "",
    status:       raw.status
                    ? raw.status.charAt(0).toUpperCase() + raw.status.slice(1).replace("_", " ")
                    : "Pending",
    image:        raw.styleReferenceImageUrl ?? null,
    // measurements
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
    id:           String(raw.id),
    clientId:     raw.clientId ?? `CLT-${String(raw.id).padStart(3, "0")}`,
    name:         raw.name  ?? "",
    email:        raw.email ?? "",
    phone:        raw.phone ?? "",
    orderCount:   raw.orderCount ?? 0,
    lastOrder:    raw.lastOrder  ?? "",
    lastOrderShort: raw.lastOrderShort ?? "",
    measurements: raw.measurements ?? {},
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

  /* ── Load orders ───────────────────────────────────────────── */
  const refreshOrders = useCallback(async () => {
    if (!userId) { setOrders([]); return; }

    // 1. Show persisted data immediately (no flash of empty)
    const cached = getOrders(userId);
    setOrders(cached);

    // 2. Try API
    setLoadingOrders(true);
    const { data, error } = await ordersApi.list();
    setLoadingOrders(false);

    if (!error && Array.isArray(data)) {
      const normalised = data.map(normaliseOrder);
      setOrders(normalised);
      saveOrders(userId, normalised);
    }
    // If API fails: cached data already shown — no action needed
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

  /* ── Bootstrap on login ────────────────────────────────────── */
  useEffect(() => {
    if (userId) {
      refreshOrders();
      refreshClients();
    } else {
      setOrders([]);
      setClients([]);
    }
  }, [userId, refreshOrders, refreshClients]);

  /* ════════════════════════════════════════════════════════════
     ORDERS CRUD
  ════════════════════════════════════════════════════════════ */

  /**
   * addOrder — try API, always persist locally.
   * body shape expected by backend:
   *   { clientId, deliveryDate, description, notes,
   *     chest, waist, hip, shoulder, sleeve, length }
   * Returns { ok, order, error }
   */
  const addOrder = async (formData) => {
    // Optimistic local record (shown immediately)
    const localId = generateId("ORD");
    const optimistic = {
      id:           localId,
      apiId:        null,
      clientId:     formData.clientId ?? null,
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

    // Try API
    const apiBody = {
      clientId:     formData.clientId,
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
      // Replace optimistic record with real one from API
      const real = normaliseOrder(data);
      const updated = next.map((o) => (o.id === localId ? real : o));
      setOrders(updated);
      saveOrders(userId, updated);
      return { ok: true, order: real };
    }
    // API failed — keep local record
    return { ok: true, order: optimistic };
  };

  /**
   * updateOrder — try API, always persist locally.
   * id = local id (ORD-xxx or order_number)
   * patch = { status, notes, deliveryDate, ... }
   */
  const updateOrder = async (id, patch) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return { ok: false, error: "Order not found" };

    const updated = { ...order, ...patch };
    // Reformat delivery if deliveryDate changed
    if (patch.deliveryDate) {
      updated.delivery = new Date(patch.deliveryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    const next = orders.map((o) => (o.id === id ? updated : o));
    setOrders(next);
    saveOrders(userId, next);

    // Try API
    if (order.apiId) {
      const apiPatch = {};
      if (patch.status)       apiPatch.status        = patch.status.toLowerCase().replace(" ", "_");
      if (patch.deliveryDate) apiPatch.delivery_date = patch.deliveryDate;
      if (patch.notes)        apiPatch.notes         = patch.notes;
      await ordersApi.update(order.apiId, apiPatch);
    }

    return { ok: true, order: updated };
  };

  /**
   * deleteOrder
   */
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
      id:       localId,
      apiId:    null,
      clientId,
      name:     formData.name  ?? "",
      email:    formData.email ?? "",
      phone:    formData.phone ?? "",
      orderCount: 0,
      lastOrder:  "",
      lastOrderShort: "",
      measurements: formData.measurements ?? {},
    };

    const next = [optimistic, ...clients];
    setClients(next);
    saveClients(userId, next);

    const { data, error } = await clientsApi.create({
      name:  formData.name,
      email: formData.email,
      measurements: formData.measurements ?? {},
    });
    if (!error && data?.client) {
      const real = normaliseClient(data.client);
      const updated = next.map((c) => (c.id === localId ? real : c));
      setClients(updated);
      saveClients(userId, updated);
      return { ok: true, client: real };
    }
    return { ok: true, client: optimistic };
  };

  const updateClient = async (id, patch) => {
    const client  = clients.find((c) => c.id === id);
    if (!client) return { ok: false, error: "Client not found" };
    const updated = { ...client, ...patch };
    const next    = clients.map((c) => (c.id === id ? updated : c));
    setClients(next);
    saveClients(userId, next);
    if (client.apiId) await clientsApi.update(client.apiId, patch);
    return { ok: true, client: updated };
  };

  const deleteClient = async (id) => {
    const client = clients.find((c) => c.id === id);
    const next   = clients.filter((c) => c.id !== id);
    setClients(next);
    saveClients(userId, next);
    if (client?.apiId) await clientsApi.delete(client.apiId);
    return { ok: true };
  };

  return (
    <DataContext.Provider value={{
      orders,  loadingOrders,  refreshOrders,
      clients, loadingClients, refreshClients,
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
