import { Navigate, Route, Routes } from 'react-router-dom';

import Navbar from '../components/Navbar.jsx';
import ChampionshipDetails from '../pages/public/ChampionshipDetails.jsx';
import Championships from '../pages/public/Championships.jsx';
import Home from '../pages/public/Home.jsx';
import Rounds from '../pages/public/Rounds.jsx';
import Standings from '../pages/public/Standings.jsx';
import ChampionshipTeams from '../pages/admin/ChampionshipTeams.jsx';
import ChampionshipsAdmin from '../pages/admin/ChampionshipsAdmin.jsx';
import Dashboard from '../pages/admin/Dashboard.jsx';
import EditMatchResult from '../pages/admin/EditMatchResult.jsx';
import Login from '../pages/admin/Login.jsx';
import MatchesAdmin from '../pages/admin/MatchesAdmin.jsx';
import Teams from '../pages/admin/Teams.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/championships"
        element={
          <PublicLayout>
            <Championships />
          </PublicLayout>
        }
      />
      <Route
        path="/championships/:id"
        element={
          <PublicLayout>
            <ChampionshipDetails />
          </PublicLayout>
        }
      />
      <Route
        path="/championships/:id/standings"
        element={
          <PublicLayout>
            <Standings />
          </PublicLayout>
        }
      />
      <Route
        path="/championships/:id/rounds"
        element={
          <PublicLayout>
            <Rounds />
          </PublicLayout>
        }
      />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<ProtectedRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="teams" element={<Teams />} />
        <Route path="championships" element={<ChampionshipsAdmin />} />
        <Route path="championships/:id/teams" element={<ChampionshipTeams />} />
        <Route path="matches" element={<MatchesAdmin />} />
        <Route path="matches/:id/result" element={<EditMatchResult />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
