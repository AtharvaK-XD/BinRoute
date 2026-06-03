import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      triggerShake();
      return;
    }

    setIsLoading(true);

    // Simulate network delay for realism
    await new Promise((r) => setTimeout(r, 800));

    const result = login(username.trim(), password);
    setIsLoading(false);

    if (result.success) {
      navigate("/dashboard", { replace: true });
    } else {
      setError(result.error);
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="login-bg-grid"></div>
      <div className="login-bg-glow login-bg-glow--1"></div>
      <div className="login-bg-glow login-bg-glow--2"></div>
      <div className="login-bg-glow login-bg-glow--3"></div>

      {/* Floating particles */}
      <div className="login-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="login-particle" style={{ '--i': i }}></div>
        ))}
      </div>

      {/* Login Card */}
      <div className={`login-card relative z-10 w-full max-w-md mx-md ${shake ? "login-shake" : ""}`}>
        
        {/* Logo & Brand */}
        <div className="text-center mb-xl">
          <div className="login-logo-ring mx-auto mb-lg">
            <div className="login-logo-inner">
              <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                recycling
              </span>
            </div>
          </div>
          <h1 className="font-h1 text-[28px] text-white mb-xs tracking-tight">
            BinRoute
          </h1>
          <p className="login-subtitle text-sm">
            Smart Waste Management Platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-md">
          
          {/* Username */}
          <div className="login-field-group">
            <label htmlFor="login-username" className="login-label">
              USERNAME
            </label>
            <div className="login-input-wrap">
              <span className="material-symbols-outlined login-input-icon">person</span>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                autoFocus
                className="login-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field-group">
            <label htmlFor="login-password" className="login-label">
              PASSWORD
            </label>
            <div className="login-input-wrap">
              <span className="material-symbols-outlined login-input-icon">lock</span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="login-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="login-eye-btn"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-xs cursor-pointer group">
              <input type="checkbox" className="login-checkbox" />
              <span className="text-xs text-[#8d96ad] group-hover:text-[#c4cbe0] transition-colors">Remember me</span>
            </label>
            <button type="button" className="text-xs text-[#a9c1ff] hover:text-white transition-colors">
              Forgot password?
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="login-submit-btn"
          >
            {isLoading ? (
              <div className="login-spinner"></div>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">login</span>
                <span>SIGN IN</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider">
          <span>DEMO CREDENTIALS</span>
        </div>

        {/* Quick credentials */}
        <div className="login-credentials-grid">
          {[
            { user: "admin", pass: "admin123", role: "Administrator" },
            { user: "operator", pass: "ops2026", role: "Operator" },
            { user: "viewer", pass: "view123", role: "Viewer" },
          ].map((cred) => (
            <button
              key={cred.user}
              type="button"
              className="login-cred-chip"
              onClick={() => {
                setUsername(cred.user);
                setPassword(cred.pass);
                setError("");
              }}
            >
              <span className="material-symbols-outlined text-[14px] text-[#a9c1ff]">person</span>
              <div className="flex-1 text-left">
                <div className="text-[11px] font-bold text-white/90 leading-tight">{cred.user}</div>
                <div className="text-[10px] text-[#8d96ad] leading-tight">{cred.role}</div>
              </div>
              <span className="material-symbols-outlined text-[14px] text-[#3d4863] group-hover:text-[#a9c1ff] transition-colors">arrow_forward</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[#66708a] mt-lg">
          © 2026 BinRoute Municipal Platform · v2.4.1
        </p>
      </div>
    </div>
  );
}
