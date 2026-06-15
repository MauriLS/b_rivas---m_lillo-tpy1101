import { useState } from "react";
import UserList from "./components/UserList";
import Login from "./components/Login";

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  return usuarioLogueado ? (
    <UserList onLogout={() => setUsuarioLogueado(null)} />
  ) : (
    <Login onLoginSuccess={(usuario) => setUsuarioLogueado(usuario)} />
  );
}

export default App;