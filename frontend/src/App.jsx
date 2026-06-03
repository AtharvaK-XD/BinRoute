import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import TopNav from "./components/TopNav";
import Dashboard from "./pages/Dashboard";
import MapView from "./pages/MapView";
import RoutesPage from "./pages/RoutesPage";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

const getInitialDarkMode = () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") return true;
  if (savedTheme === "light") return false;

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

/** Protects child routes — redirects to /login if not authenticated */
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/** Wrapper that conditionally renders the TopNav (hidden on /login) */
function AppLayout({ toggleDarkMode, isDark }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <TopNav toggleDarkMode={toggleDarkMode} isDark={isDark} />}
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/" element={<RequireAuth><Navigate to="/dashboard" replace /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/map" element={<RequireAuth><MapView /></RequireAuth>} />
        <Route path="/routes" element={<RequireAuth><RoutesPage /></RequireAuth>} />
        <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(getInitialDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((currentTheme) => !currentTheme);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background dark:bg-[#0d1322] text-on-background dark:text-inverse-on-surface transition-colors duration-200">
          <AppLayout toggleDarkMode={toggleDarkMode} isDark={isDark} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
