import { useState, useEffect } from "react";
import api from "../api";

const FORM_INITIAL = { username: "", name: "", email: "", password: "", role: "USER", active: true };

const AVATAR_COLORS = ["#2563eb","#7c3aed","#0891b2","#059669","#d97706","#dc2626","#db2777"];

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";

const getAvatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

const Avatar = ({ name, id }) => (
  <div style={{
    width: "34px", height: "34px", borderRadius: "50%",
    backgroundColor: getAvatarColor(id),
    color: "white", fontWeight: "700", fontSize: "13px",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, letterSpacing: "0.5px",
  }}>
    {getInitials(name)}
  </div>
);

const Badge = ({ role }) => (
  <span style={{
    display: "inline-block", padding: "3px 10px", borderRadius: "20px",
    fontSize: "11px", fontWeight: "700", letterSpacing: "0.4px",
    backgroundColor: role === "ADMIN" ? "#ede9fe" : "#dbeafe",
    color: role === "ADMIN" ? "#6d28d9" : "#1d4ed8",
  }}>{role}</span>
);

const StatusPill = ({ active }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
    backgroundColor: active ? "#dcfce7" : "#fee2e2",
    color: active ? "#15803d" : "#b91c1c",
  }}>
    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: active ? "#16a34a" : "#dc2626" }} />
    {active ? "Activo" : "Inactivo"}
  </span>
);

const StatCard = ({ label, value, color, bg }) => (
  <div style={{
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "20px 24px", border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    display: "flex", alignItems: "center", gap: "16px",
  }}>
    <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
      {label === "Total" ? "👥" : label === "Activos" ? "✅" : "🔑"}
    </div>
    <div>
      <div style={{ fontSize: "26px", fontWeight: "700", color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>{label}</div>
    </div>
  </div>
);

function UserList({ usuario, onLogout }) {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(FORM_INITIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const cargarUsuarios = async () => {
    try {
      const { data } = await api.get("/api/users");
      setUsuarios(data);
      setError("");
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setFormError("");
  };

  const guardarUsuario = async () => {
    if (!form.username || !form.name || !form.email) {
      setFormError("Usuario, nombre y correo son obligatorios.");
      return;
    }
    if (!editandoId && !form.password) {
      setFormError("La contraseña es obligatoria al crear un usuario.");
      return;
    }
    try {
      const payload = { ...form };
      if (editandoId && !payload.password) delete payload.password;
      if (editandoId) {
        await api.put(`/api/users/${editandoId}`, payload);
      } else {
        await api.post("/api/users", payload);
      }
      setForm(FORM_INITIAL);
      setEditandoId(null);
      setFormError("");
      cargarUsuarios();
    } catch (err) {
      setFormError(err.response?.data?.message || "Error al guardar el usuario.");
    }
  };

  const iniciarEdicion = (u) => {
    setEditandoId(u.id);
    setForm({ username: u.username, name: u.name, email: u.email, password: "", role: u.role, active: u.active });
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicion = () => { setEditandoId(null); setForm(FORM_INITIAL); setFormError(""); };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Confirmas que deseas eliminar este usuario?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      cargarUsuarios();
    } catch {
      setError("No se pudo eliminar el usuario.");
    }
  };

  const totalActivos = usuarios.filter(u => u.active).length;
  const totalAdmins = usuarios.filter(u => u.role === "ADMIN").length;

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: "1.5px solid #e2e8f0", boxSizing: "border-box",
    outline: "none", fontSize: "14px", color: "#1e293b",
    backgroundColor: "#f8fafc", transition: "all 0.2s",
  };
  const labelStyle = {
    display: "block", marginBottom: "6px", color: "#64748b",
    fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.6px",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "'Inter','Segoe UI',Roboto,sans-serif" }}>
      <style>{`
        input::placeholder { color: #94a3b8 !important; }
        .fi:focus { border-color: #3b82f6 !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.12) !important; }
        .btn-save:hover { background: #1d4ed8 !important; }
        .btn-edit:hover { background: #eff6ff !important; }
        .btn-del:hover { background: #fef2f2 !important; }
        .btn-out:hover { background: rgba(255,255,255,0.1) !important; }
        tr.urow:hover { background: #f8fafc !important; }
      `}</style>

      {/* Navbar */}
      <nav style={{
        background: "linear-gradient(90deg, #1e3a5f 0%, #1e40af 100%)",
        padding: "0 32px", height: "62px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>🛡️</span>
          <span style={{ color: "white", fontWeight: "700", fontSize: "16px", letterSpacing: "0.2px" }}>
            Sistema de Usuarios
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Avatar name={usuario?.name} id={usuario?.id || 0} />
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "white", fontSize: "13px", fontWeight: "600", lineHeight: 1.2 }}>{usuario?.name}</div>
              <Badge role={usuario?.role || "USER"} />
            </div>
          </div>
          <button className="btn-out" onClick={onLogout} style={{
            backgroundColor: "rgba(255,255,255,0.08)", color: "white",
            border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px",
            padding: "8px 16px", cursor: "pointer", fontSize: "13px",
            fontWeight: "600", transition: "all 0.2s", marginLeft: "4px",
          }}>Cerrar sesión</button>
        </div>
      </nav>

      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "32px 20px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: "0 0 4px 0", fontSize: "22px", fontWeight: "700", color: "#0f172a" }}>
            Gestión de Usuarios
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
            Administra los accesos y permisos del sistema
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          <StatCard label="Total" value={usuarios.length} color="#1e293b" bg="#f1f5f9" />
          <StatCard label="Activos" value={totalActivos} color="#15803d" bg="#dcfce7" />
          <StatCard label="Admins" value={totalAdmins} color="#6d28d9" bg="#ede9fe" />
        </div>

        {/* Formulario */}
        <div style={{
          backgroundColor: "#fff", borderRadius: "12px",
          padding: "28px", marginBottom: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          borderLeft: `4px solid ${editandoId ? "#f59e0b" : "#2563eb"}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: "18px" }}>{editandoId ? "✏️" : "➕"}</span>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>
              {editandoId ? "Editar usuario" : "Nuevo usuario"}
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Usuario</label>
              <input className="fi" name="username" value={form.username} onChange={handleChange}
                placeholder="ej: juan.perez" disabled={!!editandoId}
                style={{ ...inputStyle, opacity: editandoId ? 0.6 : 1, cursor: editandoId ? "not-allowed" : "text" }} />
            </div>
            <div>
              <label style={labelStyle}>Nombre completo</label>
              <input className="fi" name="name" value={form.name} onChange={handleChange}
                placeholder="ej: Juan Pérez" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Correo electrónico</label>
              <input className="fi" name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="ej: juan@correo.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>
                Contraseña
                {editandoId && <span style={{ color: "#94a3b8", fontWeight: "400", textTransform: "none", marginLeft: "4px" }}>· vacío = sin cambio</span>}
              </label>
              <input className="fi" name="password" type="password" value={form.password} onChange={handleChange}
                placeholder={editandoId ? "••••••••" : "Contraseña"} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Rol</label>
              <select name="role" value={form.role} onChange={handleChange}
                className="fi"
                style={{ ...inputStyle, cursor: "pointer", appearance: "auto" }}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <label style={labelStyle}>Estado</label>
              <label style={{
                display: "flex", alignItems: "center", gap: "10px",
                cursor: "pointer", padding: "11px 14px",
                borderRadius: "8px", border: "1.5px solid #e2e8f0",
                backgroundColor: "#f8fafc",
              }}>
                <input type="checkbox" name="active" checked={form.active} onChange={handleChange}
                  style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#2563eb" }} />
                <span style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>
                  {form.active ? "Activo" : "Inactivo"}
                </span>
              </label>
            </div>
          </div>

          {formError && (
            <div style={{
              backgroundColor: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "8px", padding: "10px 14px",
              color: "#dc2626", fontSize: "13px", marginTop: "16px",
              display: "flex", alignItems: "center", gap: "8px",
            }}>⚠️ {formError}</div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
            <button className="btn-save" onClick={guardarUsuario} style={{
              background: editandoId ? "linear-gradient(135deg,#f59e0b,#d97706)" : "linear-gradient(135deg,#2563eb,#1d4ed8)",
              color: "white", border: "none", borderRadius: "8px",
              padding: "11px 26px", cursor: "pointer",
              fontWeight: "600", fontSize: "14px",
              boxShadow: editandoId ? "0 3px 10px rgba(245,158,11,0.3)" : "0 3px 10px rgba(37,99,235,0.3)",
              transition: "all 0.2s",
            }}>
              {editandoId ? "Guardar cambios" : "Crear usuario"}
            </button>
            {editandoId && (
              <button onClick={cancelarEdicion} style={{
                backgroundColor: "white", color: "#64748b",
                border: "1px solid #e2e8f0", borderRadius: "8px",
                padding: "11px 20px", cursor: "pointer",
                fontWeight: "600", fontSize: "14px",
              }}>Cancelar</button>
            )}
          </div>
        </div>

        {/* Tabla */}
        <div style={{
          backgroundColor: "#fff", borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "16px 24px", borderBottom: "1px solid #e2e8f0",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#1e293b" }}>
              Directorio de usuarios
            </h2>
            <span style={{
              fontSize: "12px", fontWeight: "600", color: "#64748b",
              backgroundColor: "#f1f5f9", borderRadius: "20px", padding: "4px 12px",
            }}>
              {usuarios.length} {usuarios.length === 1 ? "registro" : "registros"}
            </span>
          </div>

          {error && (
            <div style={{ padding: "14px 24px", backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "13px", borderBottom: "1px solid #fecaca" }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr>
                  {["#", "Usuario", "Nombre", "Correo", "Rol", "Estado", "Acciones"].map(h => (
                    <th key={h} style={{
                      padding: "12px 20px", backgroundColor: "#f8fafc",
                      borderBottom: "2px solid #e2e8f0",
                      color: "#94a3b8", fontWeight: "700", fontSize: "11px",
                      textTransform: "uppercase", letterSpacing: "0.6px", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ padding: "48px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
                    Cargando usuarios...
                  </td></tr>
                ) : usuarios.length === 0 ? (
                  <tr><td colSpan="7" style={{ padding: "56px", textAlign: "center" }}>
                    <div style={{ fontSize: "36px", marginBottom: "12px" }}>👤</div>
                    <div style={{ color: "#64748b", fontWeight: "600", fontSize: "15px" }}>Sin usuarios registrados</div>
                    <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>Crea el primer usuario usando el formulario de arriba</div>
                  </td></tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u.id} className="urow" style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.12s" }}>
                      <td style={{ padding: "14px 20px", color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>
                        {u.id}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <Avatar name={u.name} id={u.id} />
                          <span style={{ color: "#1e293b", fontWeight: "600", fontSize: "14px" }}>{u.username}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", color: "#374151", fontSize: "14px" }}>{u.name}</td>
                      <td style={{ padding: "14px 20px", color: "#64748b", fontSize: "14px" }}>{u.email}</td>
                      <td style={{ padding: "14px 20px" }}><Badge role={u.role} /></td>
                      <td style={{ padding: "14px 20px" }}><StatusPill active={u.active} /></td>
                      <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                        <button className="btn-edit" onClick={() => iniciarEdicion(u)} style={{
                          backgroundColor: "transparent", color: "#2563eb",
                          border: "1px solid #bfdbfe", borderRadius: "7px",
                          padding: "6px 14px", marginRight: "8px", cursor: "pointer",
                          fontSize: "13px", fontWeight: "600", transition: "background 0.15s",
                        }}>Editar</button>
                        <button className="btn-del" onClick={() => eliminarUsuario(u.id)} style={{
                          backgroundColor: "transparent", color: "#ef4444",
                          border: "1px solid #fecaca", borderRadius: "7px",
                          padding: "6px 14px", cursor: "pointer",
                          fontSize: "13px", fontWeight: "600", transition: "background 0.15s",
                        }}>Eliminar</button>
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
