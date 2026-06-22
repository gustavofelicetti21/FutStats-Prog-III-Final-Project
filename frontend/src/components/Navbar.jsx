import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Ir para conteudo
      </a>
      <div className="site-shell header-content">
        <NavLink className="brand" to="/">
          FutStats
        </NavLink>
        <nav className="main-nav" aria-label="Navegacao publica">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/championships">Campeonatos</NavLink>
          <NavLink to="/login">Admin</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
