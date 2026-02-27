import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

/* ── Mock user store (simulate a database) ───────────────────── */
const MOCK_USERS = [
  { email: "artisan@demo.com", password: "password", role: "artisan", name: "Grace Adebayo" },
  { email: "client@demo.com",  password: "password", role: "client",  name: "Amara Okonkwo" },
];

const ROLE_ROUTES = {
  artisan: "/artisan/dashboard",
  client:  "/client/dashboard",
};

function loadUser() {
  try {
    const raw = sessionStorage.getItem("fl_user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveUser(user) {
  sessionStorage.setItem("fl_user", JSON.stringify(user));
}

function clearUser() {
  sessionStorage.removeItem("fl_user");
}

/* ── Provider ────────────────────────────────────────────────── */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  /**
   * mockLogin — checks against MOCK_USERS list.
   * Returns { ok: true, redirectTo } or { ok: false, error }
   * TODO: replace body with: const res = await fetch("/api/auth/login", ...)
   */
  const login = ({ email, password }) => {
    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return { ok: false, error: "Invalid email or password." };
    const session = { email: found.email, name: found.name, role: found.role };
    saveUser(session);
    setUser(session);
    return { ok: true, redirectTo: ROLE_ROUTES[found.role] };
  };

  /**
   * mockSignup — registers a new mock user in memory.
   * Returns { ok: true, redirectTo } or { ok: false, error }
   * TODO: replace body with: const res = await fetch("/api/auth/signup", ...)
   */
  const signup = ({ name, email, password, role }) => {
    const exists = MOCK_USERS.find((u) => u.email === email);
    if (exists) return { ok: false, error: "An account with this email already exists." };
    const newUser = { email, password, role, name };
    MOCK_USERS.push(newUser);
    const session = { email, name, role };
    saveUser(session);
    setUser(session);
    return { ok: true, redirectTo: ROLE_ROUTES[role] };
  };

  const logout = () => {
    clearUser();
    setUser(null);
  };

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
