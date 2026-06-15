import { useState } from "react";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);

    // SIMULACIÓN DE RETRASO DE RED (MOCK)
    setTimeout(() => {
      setLoading(false);
      
      // VALIDACIÓN LOCAL TEMPORAL
      if (username === "admin" && password === "admin123") {
        const usuarioMock = {
          id: 1,
          username: "admin",
          email: "admin@sistema.cl",
          nombre: "Administrador Probador"
        };
        // Pasamos el usuario simulado para cambiar de pantalla
        onLoginSuccess(usuarioMock);
      } else {
        alert("Credenciales incorrectas (Prueba con admin / admin123)");
      }
    }, 600); // Se congela medio segundo para simular una carga real
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f1f5f9",
        fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "40px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#eff6ff",
              color: "#2563eb",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              margin: "0 auto 16px auto",
            }}
          >
            🛡️
          </div>
          <h2
            style={{
              color: "#0f172a",
              margin: "0 0 8px 0",
              fontWeight: "700",
              fontSize: "24px",
            }}
          >
            Acceso al Sistema
          </h2>
          <p
            style={{
              color: "#64748b",
              margin: "0",
              fontSize: "14px",
            }}
          >
            [MODO MOCK ENTRAR CON ADMIN/ADMIN123]
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#334155",
                fontWeight: "600",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Usuario
            </label>
            <input
              type="text"
              placeholder="Ej: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                boxSizing: "border-box",
                outline: "none",
                fontSize: "15px",
                color: "#1e293b",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#cbd5e1";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#334155",
                fontWeight: "600",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                boxSizing: "border-box",
                outline: "none",
                fontSize: "15px",
                color: "#1e293b",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#cbd5e1";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#93c5fd" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "14px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "15px",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => {
              if (!loading) e.target.style.backgroundColor = "#1d4ed8";
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.backgroundColor = "#2563eb";
            }}
          >
            {loading ? "Autenticando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;