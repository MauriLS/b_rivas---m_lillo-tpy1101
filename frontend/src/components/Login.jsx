import { useState } from "react";
import api from "../api";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/auth/login", { username, password });
      onLoginSuccess(data);
    } catch (err) {
      setError(err.response?.data?.error || "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
      fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
      padding: "20px",
    }}>
      <style>{`
        input::placeholder { color: #94a3b8 !important; opacity: 1; }
        .login-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important; }
        .login-btn:hover:not(:disabled) { background-color: #1d4ed8 !important; transform: translateY(-1px); }
        .login-btn { transition: all 0.2s ease !important; }
      `}</style>

      <div style={{
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "44px 40px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px", height: "64px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            borderRadius: "18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", margin: "0 auto 20px auto",
            boxShadow: "0 8px 20px rgba(37,99,235,0.35)",
          }}>🛡️</div>
          <h2 style={{ color: "#0f172a", margin: "0 0 8px 0", fontWeight: "700", fontSize: "26px" }}>
            Acceso al Sistema
          </h2>
          <p style={{ color: "#64748b", margin: "0", fontSize: "14px" }}>
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", marginBottom: "7px", color: "#374151", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Usuario
            </label>
            <input
              className="login-input"
              type="text"
              placeholder="Introduce tu usuario"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              style={{
                width: "100%", padding: "12px 16px",
                borderRadius: "10px", border: "1.5px solid #e2e8f0",
                boxSizing: "border-box", outline: "none",
                fontSize: "15px", color: "#1e293b",
                transition: "all 0.2s ease", backgroundColor: "#f8fafc",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "7px", color: "#374151", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Contraseña
            </label>
            <input
              className="login-input"
              type="password"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              style={{
                width: "100%", padding: "12px 16px",
                borderRadius: "10px", border: "1.5px solid #e2e8f0",
                boxSizing: "border-box", outline: "none",
                fontSize: "15px", color: "#1e293b",
                transition: "all 0.2s ease", backgroundColor: "#f8fafc",
              }}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "8px", padding: "10px 14px",
              color: "#dc2626", fontSize: "14px", marginBottom: "18px",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "white", border: "none",
              borderRadius: "10px", padding: "14px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600", fontSize: "15px",
              boxShadow: loading ? "none" : "0 4px 12px rgba(37,99,235,0.3)",
            }}
          >
            {loading ? "Autenticando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", color: "#94a3b8", fontSize: "12px" }}>
          Sistema de Administración de Usuarios
        </p>
      </div>
    </div>
  );
}

export default Login;
