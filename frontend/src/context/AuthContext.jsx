/**
 * AuthContext.jsx
 *
 * Auth layer wired to the real Fashion Link API.
 * Base URL: https://fashion-link-m2y7.onrender.com
 *
 * login()  → POST /api/auth/login
 *   request : { email, password }
 *   response: { token }          ← JWT stored in localStorage as "fl_token"
 *
 * signup() → POST /api/auth/register
 *   request : { name, email, password, role }
 *   response: { id, name, email, role, createdAt, updatedAt }
 *             (no token on register — auto-login call follows)
 *
 * Session is persisted in sessionStorage (clears on tab close).
 * Token is persisted in localStorage (survives tab close).
 * Replace sessionStorage with a secure httpOnly cookie flow for production.
 */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

/* ── Constants ───────────────────────────────────────────────── */
const BASE_URL = "https://fashion-link-m2y7.onrender.com";

const ROLE_ROUTES = {
  artisan: "/artisan/dashboard",
  user:    "/artisan/dashboard",   // API returns "user"; treat as artisan portal
  client:  "/client/dashboard",
};

/* ── sessionStorage helpers (user profile, no token) ────────── */
function loadUser() {
  try {
    const raw = sessionStorage.getItem("fl_user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveUser(user)  { sessionStorage.setItem("fl_user", JSON.stringify(user)); }
function clearUser()     { sessionStorage.removeItem("fl_user"); }

/* ── localStorage helpers (JWT token) ───────────────────────── */
function saveToken(token)  { localStorage.setItem("fl_token", token); }
function clearToken()      { localStorage.removeItem("fl_token"); }
export  function getToken() { return localStorage.getItem("fl_token"); }

/* ── Provider ────────────────────────────────────────────────── */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  /**
   * login — POST /api/auth/login
   *
   * Request body : { "email": string, "password": string }
   * Success 200  : { "token": "eyJ..." }
   * Error   401  : { "message": "Incorrect password" }
   * Error   404  : { "message": "User not found" }
   *
   * Returns { ok: true, redirectTo } or { ok: false, error }
   */
  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // API returns { message: "..." } for 401 and 404
        return { ok: false, error: data.message ?? "Login failed. Please try again." };
      }

      // Success: { token: "eyJ..." }
      const token = data.token;
      saveToken(token);

      // Decode the JWT payload (base64) to extract name and role without a library.
      let name = email;
      let role = "artisan";
      try {
        const payloadB64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload    = JSON.parse(atob(payloadB64));
        name = payload.name  ?? payload.email ?? email;
        role = payload.role  ?? "artisan";
      } catch { /* malformed payload — fall back to defaults */ }

      const session = { email, name, role };
      saveUser(session);
      setUser(session);

      return { ok: true, redirectTo: ROLE_ROUTES[role] ?? ROLE_ROUTES.artisan };

    } catch (err) {
      return { ok: false, error: "Unable to reach the server. Check your connection.", err };
    }
  };

  /**
   * signup — POST /api/auth/register
   *
   * Request body : { "name": string, "email": string, "password": string, "role": string }
   * Success 201  : { id, name, email, role, createdAt, updatedAt }  ← no token
   * Error   400  : { "message": "Validation error or duplicate email" }
   *
   * After a successful register the API does NOT return a token, so we
   * immediately call login() to obtain one and complete the session.
   *
   * Returns { ok: true, redirectTo } or { ok: false, error }
   */
  const signup = async ({ name, email, password, role }) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        // API returns { message: "Validation error or duplicate email" } on 400
        return { ok: false, error: data.message ?? "Registration failed. Please try again." };
      }

      // Registration succeeded — auto-login to get the JWT
      return await login({ email, password });

    } catch (err) {
      return { ok: false, error: "Unable to reach the server. Check your connection.", err };
    }
  };

  const logout = () => {
    clearUser();
    clearToken();
    setUser(null);
  };

  /**
   * updateProfile — merges a patch into the current session (local only).
   * Used by the Settings page to persist avatar, name, prefs, etc.
   */
  const updateProfile = (patch) => {
    const updated = { ...user, ...patch };
    saveUser(updated);
    setUser(updated);
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
