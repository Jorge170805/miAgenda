import { useNavigate, Link } from 'react-router-dom';
import '../styles/layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('usuario'); // Borrar sesión
    navigate('/login'); // Redirigir al login
  };

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  return (
    <div className="layout">
      <header className="layout-header">
        <h1 className="layout-title">Mi Aplicación</h1>
        <div className="layout-welcome">👋 Bienvenido, {usuario.nombre} 
          {usuario.admin && <strong> (admin)</strong>} 
        </div>
      </header>

      <div className="layout-body">
        <aside className="layout-sidebar">
          <nav>
            <ul className="sidebar-list">
              <li><Link to="/avisos">Avisos</Link></li>
              <li><Link to="/agenda">Agenda</Link></li>
              <li><Link to="/groups">Grupos</Link></li>
              <li><Link to="/listTareas/true">Tareas</Link></li>
              {usuario.admin && 
              <>
                <hr/>
                <li><b>Administración</b></li>
                <li><Link to="/priorities">Prioridades</Link></li>
                <li><Link to="/estadosTareas">Estados Tareas</Link></li>  
              </>
              }
            </ul>

            <ul className="sidebar-logout">
                <li>
                  <button className="logout-link" onClick={handleLogout}>
                    🚪 Cerrar sesión
                  </button>
                </li>
              </ul>
            
          </nav>
        </aside>

        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
