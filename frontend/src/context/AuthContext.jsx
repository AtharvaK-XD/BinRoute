import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Demo credentials — in production, validate against your Express backend + Supabase
const VALID_USERS = [
  { username: "admin",   password: "admin123",  role: "Administrator", name: "Admin User" },
  { username: "operator", password: "ops2026",  role: "Operator",      name: "Rahul Sharma" },
  { username: "viewer",   password: "view123",  role: "Viewer",        name: "Priya Nair" },
];

const AUTH_STORAGE_KEY = "binroute:auth";

function getStoredAuth() {
  try {
    const stored = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    if (stored && stored.username) return stored;
  } catch {
    // ignore
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredAuth);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (username, password) => {
    const found = VALID_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (found) {
      const session = { username: found.username, name: found.name, role: found.role };
      setUser(session);
      return { success: true };
    }
    return { success: false, error: "Invalid username or password" };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
