import { Navigate, Outlet, useLocation } from 'react-router-dom';

import AdminNavbar from '../components/AdminNavbar.jsx';
import { isAuthenticated } from '../services/auth.js';

function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-main" id="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default ProtectedRoute;
