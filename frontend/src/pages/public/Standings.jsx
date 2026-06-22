import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import DataTable from '../../components/DataTable.jsx';
import Loading from '../../components/Loading.jsx';
import api, { getErrorMessage } from '../../services/api.js';

function Standings() {
  const { id } = useParams();
  const [championship, setChampionship] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStandings() {
      try {
        const championshipResponse = await api.get(`/championships/${id}`);
        setChampionship(championshipResponse.data);

        try {
          const standingsResponse = await api.get(`/championships/${id}/standings`);
          setStandings(standingsResponse.data);
        } catch {
          setStandings([]);
        }
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    loadStandings();
  }, [id]);

  const tableRows = standings.map((row, index) => ({
    ...row,
    id: row.team_id || index + 1,
    position: row.position || index + 1,
  }));

  const columns = [
    { key: 'position', label: '#' },
    { key: 'team_name', label: 'Time' },
    { key: 'points', label: 'Pts' },
    { key: 'played', label: 'J' },
    { key: 'wins', label: 'V' },
    { key: 'draws', label: 'E' },
    { key: 'losses', label: 'D' },
    { key: 'goals_for', label: 'GP' },
    { key: 'goals_against', label: 'GC' },
    { key: 'goal_difference', label: 'SG' },
  ];

  return (
    <section className="site-shell page-stack">
      <div className="page-title row-title">
        <div>
          <p className="eyebrow">Classificacao</p>
          <h1>{championship?.name || 'Campeonato'}</h1>
          <p>A tabela considera somente partidas finalizadas.</p>
        </div>
        <Link className="text-link" to={`/championships/${id}`}>
          Voltar
        </Link>
      </div>

      {loading ? <Loading /> : null}
      {error ? <div className="alert error">{error}</div> : null}

      {!loading && !error ? (
        <DataTable
          columns={columns}
          rows={tableRows}
          title="Tabela de classificacao"
          emptyMessage="A classificacao sera exibida quando a rota estiver disponivel."
        />
      ) : null}
    </section>
  );
}

export default Standings;
