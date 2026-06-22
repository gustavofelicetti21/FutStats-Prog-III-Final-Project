import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Loading from '../../components/Loading.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api, { getErrorMessage } from '../../services/api.js';

function Home() {
  const [championships, setChampionships] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [championshipsResponse, teamsResponse] = await Promise.all([
          api.get('/championships'),
          api.get('/teams'),
        ]);

        setChampionships(championshipsResponse.data);
        setTeams(teamsResponse.data);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const visibleChampionships = useMemo(
    () => championships.filter((championship) => championship.status !== 'deactivated').slice(0, 4),
    [championships],
  );
  const activeTeams = teams.filter((team) => team.status === 'active').length;
  const activeChampionships = championships.filter((item) => item.status === 'active').length;

  return (
    <section className="site-shell page-grid">
      <div className="page-title">
        <p className="eyebrow">Painel publico</p>
        <h1>FutStats</h1>
        <p>Campeonatos, times e classificacoes em um painel simples de acompanhar.</p>
      </div>

      <div className="metric-row">
        <article className="metric-card">
          <span>{activeChampionships}</span>
          <p>Campeonatos ativos</p>
        </article>
        <article className="metric-card">
          <span>{activeTeams}</span>
          <p>Times disponiveis</p>
        </article>
        <article className="metric-card">
          <span>{championships.length}</span>
          <p>Temporadas cadastradas</p>
        </article>
      </div>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <h2>Campeonatos recentes</h2>
            <p>Lista publica sincronizada com a API do projeto.</p>
          </div>
          <Link className="text-link" to="/championships">
            Ver todos
          </Link>
        </div>

        {loading ? <Loading /> : null}
        {error ? <div className="alert error">{error}</div> : null}

        {!loading && !error ? (
          <div className="championship-grid">
            {visibleChampionships.map((championship) => (
              <Link
                className="championship-card"
                key={championship.id}
                to={`/championships/${championship.id}`}
              >
                <div>
                  <h3>{championship.name}</h3>
                  <p>Temporada {championship.season}</p>
                </div>
                <StatusBadge status={championship.status} />
              </Link>
            ))}
            {!visibleChampionships.length ? (
              <div className="empty-state">Nenhum campeonato publico encontrado.</div>
            ) : null}
          </div>
        ) : null}
      </section>
    </section>
  );
}

export default Home;
