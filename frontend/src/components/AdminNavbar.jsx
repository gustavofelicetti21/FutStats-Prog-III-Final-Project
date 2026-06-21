import { NavLink, useNavigate } from 'react-router-dom';

import { clearSession, getUser } from '../services/auth.js';

function AdminNavbar() {
  const navigate = useNavigate();
  const user = getUser();

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  return (
    <aside className="admin-sidebar">
      <div>
        <NavLink className="brand admin-brand" to="/admin">
          FutStats
        </NavLink>
        <p className="admin-user">{user?.name || 'Administrador'}</p>
      </div>
      <nav className="admin-nav" aria-label="Navegacao administrativa">
        <NavLink to="/admin">Dashboard</NavLink>
        <NavLink to="/admin/teams">Times</NavLink>
        <NavLink to="/admin/championships">Campeonatos</NavLink>
        <NavLink to="/admin/matches">Partidas</NavLink>
      </nav>
      <button className="ghost-button" type="button" onClick={handleLogout}>
        Sair
      </button>
    </aside>
  );
}

export default AdminNavbar;
