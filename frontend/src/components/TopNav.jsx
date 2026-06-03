import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TopNav({ toggleDarkMode, isDark }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Map", path: "/map" },
    { name: "Routes", path: "/routes" },
    { name: "Analytics", path: "/analytics" },
    { name: "Settings", path: "/settings" },
  ];

  const linkClassName = ({ isActive }) =>
    `h-full flex items-center font-body-md transition-colors border-b-2 ${
      isActive
        ? "text-primary dark:text-inverse-primary font-bold border-primary dark:border-inverse-primary"
        : "text-on-surface-variant border-transparent hover:text-primary dark:hover:text-inverse-primary"
    }`;

  const mobileLinkClassName = ({ isActive }) =>
    `block px-lg py-sm font-body-md border-l-4 transition-colors ${
      isActive
        ? "text-primary dark:text-inverse-primary bg-surface-container-high dark:bg-surface-dim border-primary dark:border-inverse-primary"
        : "text-on-surface-variant border-transparent hover:bg-surface-container-high dark:hover:bg-surface-dim"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 bg-surface dark:bg-[#1A2235] border-b border-outline-variant flex items-center justify-between px-md md:px-lg transition-colors duration-200">
      <div className="flex items-center gap-xl h-full">
        <h1 className="font-h1 text-h1 text-primary dark:text-inverse-primary">BinRoute</h1>
        
        <div className="hidden md:flex items-center gap-md h-full pt-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={linkClassName}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-sm">
        <button
          type="button"
          aria-label="Open notifications"
          title="Notifications"
          className="p-sm text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-dim rounded-full transition-colors flex items-center justify-center active:scale-95"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button 
          type="button"
          onClick={toggleDarkMode}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light mode" : "Dark mode"}
          className="p-sm text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-dim rounded-full transition-colors flex items-center justify-center active:scale-95"
        >
          <span className="material-symbols-outlined">{isDark ? "light_mode" : "dark_mode"}</span>
        </button>
        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          className="md:hidden p-sm text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-dim rounded-full transition-colors flex items-center justify-center active:scale-95"
        >
          <span className="material-symbols-outlined">{isMenuOpen ? "close" : "menu"}</span>
        </button>
        
        {/* Profile button with dropdown */}
        <div className="relative">
          <button
            type="button"
            aria-label="Open user profile"
            title={user?.name || "Profile"}
            onClick={() => setIsProfileOpen((v) => !v)}
            className="w-8 h-8 ml-sm rounded-full border border-outline-variant overflow-hidden bg-primary text-on-primary flex items-center justify-center cursor-pointer text-xs font-bold"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </button>
          
          {isProfileOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
              
              <div className="absolute right-0 top-12 bg-surface dark:bg-[#1A2235] border border-outline-variant rounded-lg shadow-lg w-56 z-50 py-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User info */}
                <div className="px-md py-sm border-b border-outline-variant mb-xs">
                  <p className="font-body-md font-bold text-on-surface truncate">{user?.name || "User"}</p>
                  <p className="font-body-sm text-on-surface-variant truncate">@{user?.username || "user"}</p>
                  <span className="inline-block mt-xs px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-primary/10 text-primary dark:text-inverse-primary border border-primary/20">
                    {user?.role || "User"}
                  </span>
                </div>
                
                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-sm px-md py-sm text-error hover:bg-error/10 transition-colors font-body-md"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-surface dark:bg-[#1A2235] border-b border-outline-variant shadow-lg py-sm">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={mobileLinkClassName}
            >
              {link.name}
            </NavLink>
          ))}
          {/* Mobile logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-lg py-sm font-body-md text-error border-l-4 border-transparent hover:bg-error/10 flex items-center gap-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
