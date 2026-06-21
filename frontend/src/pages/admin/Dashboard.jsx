import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Loading from '../../components/Loading.jsx';
import api, { getErrorMessage } from '../../services/api.js';

function Dashboard() {
  const [summary, setSummary] = useState({
    teams: 0,
    activeTeams: 0,
    championships: 0,
    activeChampionships: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSummary() {
      try {
        const [teamsResponse, championshipsResponse] = await Promise.all([
          api.get('/teams'),
          api.get('/championships'),
        ]);
        const teams = teamsResponse.data;
        const championships = championshipsResponse.data;

        setSummary({
          teams: teams.length,
          activeTeams: teams.filter((team) => team.status === 'active').length,
          championships: championships.length,
          activeChampionships: championships.filter((item) => item.status === 'active').length,
        });
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  return (
    <section className="admin-page">
      <div className="page-title">
        <p className="eyebrow">Admin</p>
        <h1>Dashboard</h1>
      </div>

      {loading ? <Loading /> : null}
      {error ? <div className="alert error">{error}</div> : null}

      {!loading && !error ? (
        <>
          <div className="metric-row compact">
            <article className="metric-card">
              <span>{summary.teams}</span>
              <p>Times cadastrados</p>
            </article>
            <article className="metric-card">
              <span>{summary.activeTeams}</span>
              <p>Times ativos</p>
            </article>
            <article className="metric-card">
              <span>{summary.championships}</span>
              <p>Campeonatos</p>
            </article>
            <article className="metric-card">
              <span>{summary.activeChampionships}</span>
              <p>Campeonatos ativos</p>
            </article>
          </div>

          <section className="content-section">
            <div className="section-heading">
              <div>
                <h2>Atalhos</h2>
                <p>Acesse as principais areas do painel.</p>
              </div>
            </div>
            <div className="action-grid dashboard-actions">
              <Link className="action-card" to="/admin/teams">
                <strong>Times</strong>
                <span>Cadastrar, editar e desativar times.</span>
              </Link>
              <Link className="action-card" to="/admin/championships">
                <strong>Campeonatos</strong>
                <span>Gerenciar temporadas e status.</span>
              </Link>
              <Link className="action-card" to="/admin/matches">
                <strong>Partidas</strong>
                <span>Acompanhar jogos quando a API estiver pronta.</span>
              </Link>
            </div>
          </section>
        </>
      ) : null}
    </section>
  );
}

export default Dashboard;
