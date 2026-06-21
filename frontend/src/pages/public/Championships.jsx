import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Loading from '../../components/Loading.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api, { getErrorMessage } from '../../services/api.js';

function Championships() {
  const [championships, setChampionships] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadChampionships() {
      try {
        const response = await api.get('/championships');
        setChampionships(response.data);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    loadChampionships();
  }, []);

  const visibleChampionships = useMemo(() => {
    return championships.filter((championship) => {
      if (championship.status === 'deactivated') {
        return false;
      }

      if (statusFilter === 'all') {
        return true;
      }

      return championship.status === statusFilter;
    });
  }, [championships, statusFilter]);

  return (
    <section className="site-shell page-stack">
      <div className="page-title row-title">
        <div>
          <p className="eyebrow">Campeonatos</p>
          <h1>Temporadas</h1>
        </div>
        <div className="segmented-control" aria-label="Filtrar campeonatos">
          {['all', 'active', 'finished', 'draft'].map((status) => (
            <button
              className={statusFilter === status ? 'selected' : ''}
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'Todos' : status}
            </button>
          ))}
        </div>
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
            <div className="empty-state">Nenhum campeonato encontrado.</div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default Championships;
