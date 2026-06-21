import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Loading from '../../components/Loading.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api, { getErrorMessage } from '../../services/api.js';

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'finished', label: 'Finalizados' },
  { value: 'draft', label: 'Rascunhos' },
];

function Championships() {
  const [championships, setChampionships] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
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
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return championships.filter((championship) => {
      if (championship.status === 'deactivated') {
        return false;
      }

      if (statusFilter === 'all') {
        return matchesSearch(championship, normalizedSearch);
      }

      return championship.status === statusFilter && matchesSearch(championship, normalizedSearch);
    });
  }, [championships, searchTerm, statusFilter]);

  function matchesSearch(championship, normalizedSearch) {
    if (!normalizedSearch) {
      return true;
    }

    return [championship.name, championship.season]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);
  }

  return (
    <section className="site-shell page-stack">
      <div className="page-title row-title">
        <div>
          <p className="eyebrow">Campeonatos</p>
          <h1>Temporadas</h1>
        </div>
        <div className="segmented-control" aria-label="Filtrar campeonatos">
          {statusOptions.map((option) => (
            <button
              className={statusFilter === option.value ? 'selected' : ''}
              key={option.value}
              type="button"
              onClick={() => setStatusFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-row">
        <label className="search-field" htmlFor="championship-search">
          <span>Buscar campeonato</span>
          <input
            id="championship-search"
            type="search"
            placeholder="Nome ou temporada"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
        <p className="result-count">
          {visibleChampionships.length} campeonato{visibleChampionships.length === 1 ? '' : 's'}
        </p>
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
