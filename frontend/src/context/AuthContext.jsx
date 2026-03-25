/**
 * AuthContext.jsx
 *
 * Wired to the Fashion Link API (finalPostman.json).
 * Base URL: https://fashion-link-m2y7.onrender.com
 *
 * ── Auth endpoints ────────────────────────────────────────────
 *
 * POST /api/auth/register
 *   Request : { "name": string, "email": string, "password": string, "role": "artisan"|"client"|"admin" }
 *   Success 201 : { "token": "eyJ...", "user": { id, name, email, role, createdAt, updatedAt } }
 *   Error   400 : { "message": "Role must be \"artisan\", \"client\", or \"admin\"" }
 *   → After success: redirect to /login (NOT dashboard — user must sign in)
 *
 * POST /api/auth/login
 *   Request : { "email": string, "password": string }
 *   Success 200 : { "token": "eyJ...", "user": { id, name, email, role, createdAt, updatedAt } }
 *   Error   401 : { "message": "Incorrect password" }
 *   Error   404 : { "message": "User not found" }
 *   → Token field: "token"
 *   → After success: redirect based on role
 *
 * ── Name normalisation ────────────────────────────────────────
 * The backend stores and returns a single "name" field ("John Doe").
 * The UI needs firstName and lastName separately (for the Sidebar,
 * Header avatar initial, and Settings page).
 *
 * splitName("John Doe")  → { firstName: "John", lastName: "Doe" }
 * splitName("John")      → { firstName: "John", lastName: "" }
 * splitName("")          → { firstName: "", lastName: "" }
 *
 * The session object stored in sessionStorage always contains:
 *   { id, email, role, firstName, lastName, fullName, avatar? }
 *
 * ── Storage ───────────────────────────────────────────────────
 * Token  → localStorage  "fl_token"   (survives tab close)
 * User   → sessionStorage "fl_user"   (clears on tab close)
 */
import { createContext, useContext, useState } from "react";
import { registerClient } from "../services/store.js";

const AuthContext = createContext(null);

/* ── Constants ───────────────────────────────────────────────── */
const BASE_URL = "https://fashion-link-m2y7.onrender.com";

const ROLE_ROUTES = {
  artisan: "/artisan/dashboard",
  client:  "/client/dashboard",
  admin:   "/artisan/dashboard",
};

/* ── Name splitter ───────────────────────────────────────────── */
/**
 * splitName("Grace Adebayo")  → { firstName: "Grace", lastName: "Adebayo" }
 * splitName("Grace A B")      → { firstName: "Grace", lastName: "A B" }  (all after first word)
 * splitName("Grace")          → { firstName: "Grace", lastName: "" }
 * splitName("")               → { firstName: "", lastName: "" }
 */
function splitName(fullName = "") {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const spaceIdx = trimmed.indexOf(" ");
  if (spaceIdx === -1) return { firstName: trimmed, lastName: "" };
  return {
    firstName: trimmed.slice(0, spaceIdx),
    lastName:  trimmed.slice(spaceIdx + 1).trim(),
  };
}

/* ── Session builder ─────────────────────────────────────────── */
/**
 * Builds the normalised session object from an API user payload.
 * Always returns: { id, email, role, firstName, lastName, fullName }
 */
function buildSession(apiUser) {
  const fullName = apiUser.name ?? "";
  const { firstName, lastName } = splitName(fullName);
  return {
    id:        apiUser.id   ?? null,
    email:     apiUser.email ?? "",
    role:      apiUser.role  ?? "artisan",
    firstName,
    lastName,
    fullName,
  };
}

/* ── localStorage helpers (user profile — persists across refreshes) */
function loadUser() {
  try {
    const raw = localStorage.getItem("fl_user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveUser(user) { localStorage.setItem("fl_user", JSON.stringify(user)); }
function clearUser()    { localStorage.removeItem("fl_user"); }

/* ── localStorage helpers (JWT) ──────────────────────────────── */
function saveToken(token) { localStorage.setItem("fl_token", token); }
function clearToken()     { localStorage.removeItem("fl_token"); }
export function getToken()  { return localStorage.getItem("fl_token"); }

/* ══════════════════════════════════════════════════════════════ */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  /* ── login ─────────────────────────────────────────────────── */
  /**
   * POST /api/auth/login
   * Request body : { email, password }
   * Success 200  : { token, user: { id, name, email, role, ... } }
   * Error   401  : { message: "Incorrect password" }
   * Error   404  : { message: "User not found" }
   *
   * Returns { ok: true, redirectTo } | { ok: false, error }
   */
  const login = async ({ email, password }) => {
    try {
      const res  = await fetch(`${BASE_URL}/api/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { ok: false, error: data.message ?? "Login failed. Please try again." };
      }

      // Success: { token, user: { id, name, email, role } }
      saveToken(data.token);

      const session = buildSession(data.user ?? { email });

      // Merge back locally-saved profile fields (avatar, phones, socials, etc.)
      // that the API does not return, so a re-login never wipes them.
      const existing = loadUser();
      const merged = existing && existing.email === session.email
        ? { ...existing, ...session }   // keep local extras, overwrite API fields
        : session;

      saveUser(merged);
      setUser(merged);

      // Register client in global registry so artisans can find them
      if (session.role === "client") {
        registerClient({ id: session.id, email: session.email, fullName: session.fullName, firstName: session.firstName, lastName: session.lastName, phone: session.phone ?? "" });
      }

      const redirectTo = ROLE_ROUTES[session.role] ?? ROLE_ROUTES.artisan;
      return { ok: true, redirectTo };

    } catch {
      return { ok: false, error: "Unable to reach the server. Check your connection." };
    }
  };

  /* ── signup ────────────────────────────────────────────────── */
  /**
   * POST /api/auth/register
   * Request body : { name, email, password, role }
   * Success 201  : { token, user: { id, name, email, role, ... } }
   * Error   400  : { message: "Role must be \"artisan\", \"client\", or \"admin\"" }
   *
   * On success → returns { ok: true, redirectTo: "/login" }
   * Caller (SignupPage) navigates to /login so the user signs in explicitly.
   * We intentionally do NOT auto-login or store a session after registration.
   *
   * Returns { ok: true, redirectTo } | { ok: false, error }
   */
  const signup = async ({ name, email, password, role }) => {
    try {
      const res  = await fetch(`${BASE_URL}/api/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { ok: false, error: data.message ?? "Registration failed. Please try again." };
      }

      // Registration succeeded — redirect to /login, NOT the dashboard.
      return { ok: true, redirectTo: "/login" };

    } catch {
      return { ok: false, error: "Unable to reach the server. Check your connection." };
    }
  };

  /* ── logout ────────────────────────────────────────────────── */
  const logout = () => {
    clearUser();
    clearToken();
    setUser(null);
  };

  /* ── updateProfile ─────────────────────────────────────────── */
  /**
   * Merges a patch into the current session (local only).
   * Accepts partial updates: { firstName, lastName, avatar, ... }
   * Automatically keeps fullName in sync when first/lastName change.
   */
  const updateProfile = (patch) => {
    const merged = { ...user, ...patch };

    // Keep fullName consistent if firstName or lastName was updated
    if (patch.firstName !== undefined || patch.lastName !== undefined) {
      const fn = merged.firstName ?? "";
      const ln = merged.lastName  ?? "";
      merged.fullName = [fn, ln].filter(Boolean).join(" ");
    }

    saveUser(merged);
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, ROLE_ROUTES }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ── Hook ────────────────────────────────────────────────────── */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
