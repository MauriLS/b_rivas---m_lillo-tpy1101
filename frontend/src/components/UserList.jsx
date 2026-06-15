import { useState, useEffect } from "react";

function UserList({ onLogout }) {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [editandoUsuario, setEditandoUsuario] = useState(null);

  // 1. CARGAR USUARIOS DESDE EL BACKEND
  const cargarUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/usuarios");
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        console.error("Error al obtener usuarios:", response.statusText);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // 2. AGREGAR O ACTUALIZAR USUARIO
  const guardarUsuario = async () => {
    if (!nombre || !correo) {
      alert("Completa todos los campos");
      return;
    }

    const payload = {
      username: nombre,
      email: correo,
      password: "clave123", // Contraseña por defecto solicitada
    };

    try {
      if (editandoUsuario) {
        // Modo Edición (PUT)
        const response = await fetch(`http://localhost:8080/api/usuarios/${editandoUsuario.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setEditandoUsuario(null);
          setNombre("");
          setCorreo("");
          cargarUsuarios();
        } else {
          alert("Error al actualizar el usuario");
        }
      } else {
        // Modo Creación (POST)
        const response = await fetch("http://localhost:8080/api/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setNombre("");
          setCorreo("");
          cargarUsuarios();
        } else {
          alert("Error al crear el usuario");
        }
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert("Error de conexión con el backend");
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

  // 5. ELIMINAR USUARIO
  const eliminarUsuario = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este registro del sistema?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        cargarUsuarios();
      } else {
        alert("Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error de conexión con el backend");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9", // Gris claro corporativo
        padding: "40px 20px",
        fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Cabecera del Dashboard */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ color: "#0f172a", margin: "0 0 8px 0", fontSize: "28px", fontWeight: "700" }}>
              Panel de Control
            </h1>
            <p style={{ color: "#64748b", margin: "0", fontSize: "15px" }}>
              Administración de accesos y credenciales
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
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#f8fafc";
              e.target.style.color = "#0f172a";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#475569";
            }}
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
                placeholder="Ej: jdoe"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  fontSize: "15px",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
              />
            </div>

            <div style={{ flex: "1", minWidth: "200px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Correo Electrónico</label>
              <input
                type="email"
                placeholder="usuario@empresa.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  fontSize: "15px",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
              />
            </div>

            <button
              onClick={guardarUsuario}
              style={{
                backgroundColor: "#2563eb", // Azul principal
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
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#f1f5f9";
                  e.target.style.color = "#0f172a";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.color = "#64748b";
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Listado de Usuarios */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            overflow: "hidden", // Para redondear bordes de la tabla
          }}
        >
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
             <h2 style={{ color: "#1e293b", margin: "0", fontSize: "16px", fontWeight: "600" }}>
              Directorio de Usuarios Registrados
            </h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
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
                    <tr key={usuario.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background-color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{ padding: "16px 24px", color: "#475569", fontSize: "15px" }}>{usuario.id}</td>
                      <td style={{ padding: "16px 24px", color: "#0f172a", fontSize: "15px", fontWeight: "500" }}>{usuario.username}</td>
                      <td style={{ padding: "16px 24px", color: "#475569", fontSize: "15px" }}>{usuario.email}</td>

                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <button
                          onClick={() => iniciarEdicion(usuario)}
                          style={{
                            backgroundColor: "transparent",
                            color: "#3b82f6", // Azul claro
                            border: "1px solid #bfdbfe",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            marginRight: "8px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "600",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = "#eff6ff"}
                          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => eliminarUsuario(usuario.id)}
                          style={{
                            backgroundColor: "transparent",
                            color: "#ef4444", // Rojo peligro
                            border: "1px solid #fecaca",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "600",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = "#fef2f2"}
                          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
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