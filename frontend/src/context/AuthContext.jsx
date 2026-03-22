import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

/* ── Constants ────────────── */
const BASE_URL = "https://fashion-link-m2y7.onrender.com";

const ROLE_ROUTES = {
  artisan: "/artisan/dashboard",
  client:  "/client/dashboard",
  admin:   "/artisan/dashboard",
};

/* ── Name splitter ──────────── */
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

/* ── Session builder ───────── */

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

/* ── sessionStorage helpers ────── */
function loadUser() {
  try {
    const raw = sessionStorage.getItem("fl_user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveUser(user) { sessionStorage.setItem("fl_user", JSON.stringify(user)); }
function clearUser()    { sessionStorage.removeItem("fl_user"); }

/* ── localStorage helpers (JWT) ────────── */
function saveToken(token) { localStorage.setItem("fl_token", token); }
function clearToken()     { localStorage.removeItem("fl_token"); }
export function getToken()  { return localStorage.getItem("fl_token"); }

/* ══════════════════════════════════════════════════════════════ */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  /* ── login ─────────────────────────────────────────────────── */
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
      saveUser(session);
      setUser(session);

      const redirectTo = ROLE_ROUTES[session.role] ?? ROLE_ROUTES.artisan;
      return { ok: true, redirectTo };

    } catch {
      return { ok: false, error: "Unable to reach the server. Check your connection." };
    }
  };

  /* ── signup ────────────────────────────────────────────────── */

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
