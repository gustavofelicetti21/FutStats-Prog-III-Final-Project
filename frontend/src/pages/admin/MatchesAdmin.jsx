import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import DataTable from '../../components/DataTable.jsx';
import Loading from '../../components/Loading.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api, { getErrorMessage } from '../../services/api.js';

function MatchesAdmin() {
  const [matches, setMatches] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMatches() {
      try {
        const response = await api.get('/matches');
        setMatches(response.data);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  const visibleMatches = useMemo(() => {
    if (statusFilter === 'all') {
      return matches;
    }

    return matches.filter((match) => match.status === statusFilter);
  }, [matches, statusFilter]);

  const rows = visibleMatches.map((match) => ({
    ...match,
    home_team_name: match.HomeTeam?.name || match.home_team_id,
    away_team_name: match.AwayTeam?.name || match.away_team_id,
    score: `${match.home_goals} x ${match.away_goals}`,
  }));

  const columns = [
    { key: 'championship_id', label: 'Camp.' },
    { key: 'round_id', label: 'Rodada' },
    { key: 'home_team_name', label: 'Mandante' },
    { key: 'score', label: 'Placar' },
    { key: 'away_team_name', label: 'Visitante' },
    { key: 'status', label: 'Status', render: (match) => <StatusBadge status={match.status} /> },
    {
      key: 'actions',
      label: 'Acoes',
      render: (match) => (
        <div className="table-actions">
          <Link className="secondary-button" to={`/admin/matches/${match.id}/result`}>
            Resultado
          </Link>
        </div>
      ),
    },
  ];

  return (
    <section className="admin-page">
      <div className="page-title row-title">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Partidas</h1>
        </div>
        <div className="segmented-control" aria-label="Filtrar partidas">
          {[
            { value: 'all', label: 'Todas' },
            { value: 'scheduled', label: 'Agendadas' },
            { value: 'finished', label: 'Finalizadas' },
          ].map((option) => (
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

      {loading ? <Loading /> : null}
      {error ? <div className="alert error">{error}</div> : null}

      {!loading && !error ? (
        <DataTable
          columns={columns}
          rows={rows}
          title="Partidas cadastradas"
          emptyMessage="Nenhuma partida encontrada."
        />
      ) : null}
    </section>
  );
}

export default MatchesAdmin;
