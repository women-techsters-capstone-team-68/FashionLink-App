import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth }               from "./AuthContext.jsx";
import { ordersApi, clientsApi } from "../services/api.js";
import {
  getOrders, saveOrders, getClients, saveClients, generateId,
  pushOrderToClient, removeOrderFromClient,
  registerArtisan,
} from "../services/store.js";

const DataContext = createContext(null);

function normaliseOrder(raw) {
  const status = raw.status ?? "pending";
  const capitalised = status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
  return {
    id:           raw.order_number ?? String(raw.id),
    apiId:        raw.id ?? null,
    clientId:     raw.ClientId ?? raw.clientId ?? null,
    clientEmail:  raw.clientEmail ?? raw.client?.email ?? null,
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
      chest: raw.chest ?? "", waist: raw.waist ?? "", hip: raw.hip ?? "",
      shoulder: raw.shoulder ?? "", sleeve: raw.sleeve ?? "", length: raw.length ?? "",
    },
  };
}

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

export function DataProvider({ children }) {
  const { user } = useAuth();
  const userId   = user?.id ?? user?.email ?? null;

  const [orders,         setOrders]         = useState([]);
  const [clients,        setClients]        = useState([]);
  const [loadingOrders,  setLoadingOrders]  = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);

  // Live orderCount per client
  const clientsWithOrderCount = useMemo(() => clients.map((c) => ({
    ...c,
    orderCount: orders.filter((o) => o.clientId === c.id || o.clientId === c.apiId).length,
  })), [clients, orders]);

  const getClientEmail = useCallback((clientId) => {
    const found = clients.find((c) => c.id === clientId || c.apiId === clientId);
    return found?.email ?? null;
  }, [clients]);

  // PRIORITY 1 FIX: robust order persistence
  // 1. Always show localStorage immediately (no flash)
  // 2. Fetch from API in background
  // 3. Merge: API data wins for items that exist in API; keep local-only items
  // 4. Save merged result back to localStorage
  const refreshOrders = useCallback(async () => {
    if (!userId) { setOrders([]); return; }

    // Step 1: show cached immediately
    const cached = getOrders(userId);
    if (cached.length > 0) setOrders(cached);

    setLoadingOrders(true);
    const { data, error } = await ordersApi.list();
    setLoadingOrders(false);

    if (!error && Array.isArray(data)) {
      const fromApi = data.map(normaliseOrder);
      // Merge: keep any locally-created orders not yet in API (no apiId match)
      const apiIds = new Set(fromApi.map((o) => String(o.apiId ?? o.id)));
      const localOnly = cached.filter((o) => o.apiId === null && !apiIds.has(o.id));
      const merged = [...fromApi, ...localOnly];
      setOrders(merged);
      saveOrders(userId, merged);
    } else {
      // API failed — keep showing cached data, don't wipe it
      if (cached.length > 0) setOrders(cached);
    }
  }, [userId]);

  const refreshClients = useCallback(async () => {
    if (!userId) { setClients([]); return; }
    const cached = getClients(userId);
    if (cached.length > 0) setClients(cached);
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
    if (userId) {
      refreshOrders();
      refreshClients();
      // Register artisan in global registry so they appear in network
      if (user?.role === "artisan") {
        registerArtisan({
          id:           userId,
          name:         user.fullName ?? user.firstName ?? "",
          email:        user.email ?? "",
          businessName: user.businessName ?? "",
          role:         "Fashion Artisan",
          location:     user.location ?? "",
          country:      user.country ?? "",
          experience:   user.yearsExp ?? 0,
          experienceLevel: user.expLevel ?? "beginner",
          categories:   user.categories ?? [],
          collabTypes:  user.collabTypes ?? [],
          skills:       user.skills ?? [],
          bio:          user.bio ?? "",
          avatar:       user.avatar ?? null,
          phones:       user.phones ?? [],
          socials:      user.socials ?? {},
          address:      user.address ?? "",
          portfolioLinks: user.portfolioLinks ?? [],
          rating:       5.0,
          isRealUser:   true,
        });
      }
    } else {
      setOrders([]);
      setClients([]);
    }
  }, [userId]);

  // CRUD — every write also mirrors to client's bucket

  const addOrder = async (formData) => {
    const localId     = generateId("ORD");
    const clientId    = formData.clientId ?? null;
    const clientEmail = getClientEmail(clientId) ?? formData.clientEmail ?? null;

    const optimistic = {
      id: localId, apiId: null, clientId, clientEmail,
      client: formData.clientName ?? "",
      description: formData.description ?? "", notes: formData.notes ?? "",
      delivery: formData.deliveryDate
        ? new Date(formData.deliveryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "",
      deliveryDate: formData.deliveryDate ?? "",
      placedDate: new Date().toISOString(),
      status: "Pending", image: formData.image ?? null,
      measurements: {
        chest: formData.chest ?? "", waist: formData.waist ?? "",
        hip: formData.hip ?? "", shoulder: formData.shoulder ?? "",
        sleeve: formData.sleeve ?? "", length: formData.length ?? "",
      },
    };

    const next = [optimistic, ...orders];
    setOrders(next);
    saveOrders(userId, next);
    pushOrderToClient(clientEmail, optimistic);

    const apiBody = {
      clientId: formData.apiClientId ?? formData.clientId,
      deliveryDate: formData.deliveryDate, description: formData.description, notes: formData.notes,
      chest:    formData.chest    ? Number(formData.chest)    : undefined,
      waist:    formData.waist    ? Number(formData.waist)    : undefined,
      hip:      formData.hip      ? Number(formData.hip)      : undefined,
      shoulder: formData.shoulder ? Number(formData.shoulder) : undefined,
      sleeve:   formData.sleeve   ? Number(formData.sleeve)   : undefined,
      length:   formData.length   ? Number(formData.length)   : undefined,
    };
    const { data, error } = await ordersApi.create(apiBody);
    if (!error && data) {
      const real = normaliseOrder(data);
      real.clientId = clientId;
      real.clientEmail = clientEmail;
      const updated = next.map((o) => (o.id === localId ? real : o));
      setOrders(updated);
      saveOrders(userId, updated);
      pushOrderToClient(clientEmail, real);
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
    pushOrderToClient(updated.clientEmail ?? order.clientEmail, updated);
    if (order.apiId) {
      const apiPatch = {};
      if (patch.status)       apiPatch.status        = patch.status.toLowerCase().replace(/ /g, "_");
      if (patch.deliveryDate) apiPatch.delivery_date = patch.deliveryDate;
      if (patch.notes !== undefined) apiPatch.notes  = patch.notes;
      if (patch.measurements) {
        Object.assign(apiPatch, {
          chest:    Number(patch.measurements.chest)    || undefined,
          waist:    Number(patch.measurements.waist)    || undefined,
          hip:      Number(patch.measurements.hip)      || undefined,
          shoulder: Number(patch.measurements.shoulder) || undefined,
          sleeve:   Number(patch.measurements.sleeve)   || undefined,
          length:   Number(patch.measurements.length)   || undefined,
        });
      }
      await ordersApi.update(order.apiId, apiPatch);
    }
    return { ok: true, order: updated };
  };

  const deleteOrder = async (id) => {
    const order = orders.find((o) => o.id === id);
    const next  = orders.filter((o) => o.id !== id);
    setOrders(next);
    saveOrders(userId, next);
    removeOrderFromClient(order?.clientEmail, id);
    if (order?.apiId) await ordersApi.delete(order.apiId);
    return { ok: true };
  };

  const addClient = async (formData) => {
    const localId  = generateId("cli");
    const clientId = `CLT-${String(clients.length + 1).padStart(3, "0")}`;
    const optimistic = {
      id: localId, apiId: null, clientId,
      name: formData.name ?? "", email: formData.email ?? "", phone: formData.phone ?? "",
      lastOrder: "", lastOrderShort: "", measurements: formData.measurements ?? {},
    };
    const next = [optimistic, ...clients];
    setClients(next);
    saveClients(userId, next);
    const { data, error } = await clientsApi.create({ name: formData.name, email: formData.email, measurements: formData.measurements ?? {} });
    if (!error && data?.client) {
      const real = normaliseClient(data.client);
      real.measurements = optimistic.measurements;
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
    const merged = { ...client, ...patch };
    if (patch.measurements) merged.measurements = { ...client.measurements, ...patch.measurements };
    const next = clients.map((c) => (c.id === id ? merged : c));
    setClients(next);
    saveClients(userId, next);
    if (client.apiId) await clientsApi.update(client.apiId, patch);
    return { ok: true, client: merged };
  };

  const deleteClient = async (id) => {
    const client = clients.find((c) => c.id === id);
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
      orders, clients: clientsWithOrderCount,
      loadingOrders, loadingClients,
      refreshOrders, refreshClients, getClientEmail,
      addOrder, updateOrder, deleteOrder,
      addClient, updateClient, deleteClient,
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
