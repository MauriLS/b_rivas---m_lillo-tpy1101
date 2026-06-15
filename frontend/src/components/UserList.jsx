import { useState, useEffect } from "react";

function UserList({ onLogout }) {
  // Inicializamos con datos mock para que puedas visualizar y usar la tabla de inmediato
  const [usuarios, setUsuarios] = useState([
    { id: 1, username: "admin", email: "admin@empresa.com" },
    { id: 2, username: "mrodriguez", email: "mauricio@empresa.com" },
    { id: 3, username: "jdoe", email: "jdoe@empresa.com" }
  ]);
  
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [editandoUsuario, setEditandoUsuario] = useState(null);

  // 1. CARGAR USUARIOS
  const cargarUsuarios = async () => {
    /* DESCOMENTAR CUANDO EL BACKEND ESTÉ LISTO
    try {
      const response = await fetch("http://localhost:8080/api/usuarios");
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) { console.error("Error de conexión:", error); }
    */
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // 2. AGREGAR O ACTUALIZAR USUARIO (MOCK)
  const guardarUsuario = async () => {
    if (!nombre || !correo) {
      alert("Completa todos los campos");
      return;
    }

    if (editandoUsuario) {
      // SIMULACIÓN LOCAL DE EDICIÓN
      setUsuarios(usuarios.map(u => u.id === editandoUsuario.id ? { ...u, username: nombre, email: correo } : u));
      setEditandoUsuario(null);
      setNombre("");
      setCorreo("");

      /* DESCOMENTAR CUANDO EL BACKEND ESTÉ LISTO
      const payload = { username: nombre, email: correo, password: "clave123" };
      await fetch(`http://localhost:8080/api/usuarios/${editandoUsuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      cargarUsuarios();
      */
    } else {
      // SIMULACIÓN LOCAL DE CREACIÓN
      const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
      const nuevoUsuario = { id: nuevoId, username: nombre, email: correo };
      setUsuarios([...usuarios, nuevoUsuario]);
      setNombre("");
      setCorreo("");

      /* DESCOMENTAR CUANDO EL BACKEND ESTÉ LISTO
      const payload = { username: nombre, email: correo, password: "clave123" };
      await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      cargarUsuarios();
      */
    }
  };

  // 3. INICIAR EDICIÓN
  const iniciarEdicion = (usuario) => {
    setEditandoUsuario(usuario);
    setNombre(usuario.username);
    setCorreo(usuario.email);
  };

  // 4. CANCELAR EDICIÓN
  const cancelarEdicion = () => {
    setEditandoUsuario(null);
    setNombre("");
    setCorreo("");
  };

  // 5. ELIMINAR USUARIO (MOCK)
  const eliminarUsuario = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este registro del sistema?")) {
      return;
    }

    // SIMULACIÓN LOCAL DE ELIMINACIÓN
    setUsuarios(usuarios.filter(u => u.id !== id));

    /* DESCOMENTAR CUANDO EL BACKEND ESTÉ LISTO
    await fetch(`http://localhost:8080/api/usuarios/${id}`, { method: "DELETE" });
    cargarUsuarios();
    */
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        padding: "40px 20px",
        fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Inyección de estilo para cambiar el color de los placeholders */}
      <style>{`
        input::placeholder {
          color: #94a3b8 !important;
          opacity: 1;
        }
      `}</style>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Cabecera del Dashboard */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ color: "#0f172a", margin: "0 0 8px 0", fontSize: "28px", fontWeight: "700" }}>
              Panel de Control
            </h1>
            <p style={{ color: "#64748b", margin: "0", fontSize: "15px" }}>
              Administración de accesos y credenciales [MODO MOCK ACTIVO]
            </p>
          </div>
          <button
            onClick={onLogout}
            style={{
              backgroundColor: "transparent",
              color: "#475569",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              padding: "10px 16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => { e.target.style.backgroundColor = "#f8fafc"; e.target.style.color = "#0f172a"; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = "transparent"; e.target.style.color = "#475569"; }}
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Módulo de Formulario */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          }}
        >
          <h2 style={{ color: "#1e293b", margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
            {editandoUsuario ? "Editar Registro" : "Nuevo Registro"}
          </h2>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Nombre de Usuario</label>
              <input
                type="text"
                placeholder="Introduce el nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  fontSize: "15px",
                }}
              />
            </div>

            <div style={{ flex: "1", minWidth: "200px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Correo Electrónico</label>
              <input
                type="email"
                placeholder="Introduce el correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  fontSize: "15px",
                }}
              />
            </div>

            <button
              onClick={guardarUsuario}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "15px",
                height: "45px",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
            >
              {editandoUsuario ? "Guardar Cambios" : "Agregar Usuario"}
            </button>

            {editandoUsuario && (
              <button
                onClick={cancelarEdicion}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#64748b",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "15px",
                  height: "45px",
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Listado de Usuarios */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
            <h2 style={{ color: "#1e293b", margin: "0", fontSize: "16px", fontWeight: "600" }}>
              Directorio de Usuarios Registrados
            </h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr>
                  <th style={{ padding: "16px 24px", borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: "600", fontSize: "13px", textTransform: "uppercase" }}>ID</th>
                  <th style={{ padding: "16px 24px", borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: "600", fontSize: "13px", textTransform: "uppercase" }}>Nombre de Usuario</th>
                  <th style={{ padding: "16px 24px", borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: "600", fontSize: "13px", textTransform: "uppercase" }}>Correo Electrónico</th>
                  <th style={{ padding: "16px 24px", borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: "32px", textAlign: "center", color: "#64748b", fontSize: "15px" }}>
                      No hay usuarios registrados en el sistema.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "16px 24px", color: "#475569", fontSize: "15px" }}>{usuario.id}</td>
                      <td style={{ padding: "16px 24px", color: "#0f172a", fontSize: "15px", fontWeight: "500" }}>{usuario.username}</td>
                      <td style={{ padding: "16px 24px", color: "#475569", fontSize: "15px" }}>{usuario.email}</td>

                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <button
                          onClick={() => iniciarEdicion(usuario)}
                          style={{
                            backgroundColor: "transparent",
                            color: "#3b82f6",
                            border: "1px solid #bfdbfe",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            marginRight: "8px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => eliminarUsuario(usuario.id)}
                          style={{
                            backgroundColor: "transparent",
                            color: "#ef4444",
                            border: "1px solid #fecaca",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserList;