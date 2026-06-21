import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Loading from '../../components/Loading.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api, { getErrorMessage } from '../../services/api.js';

function ChampionshipTeams() {
  const { id } = useParams();
  const [championship, setChampionship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadChampionship() {
      try {
        const response = await api.get(`/championships/${id}`);
        setChampionship(response.data);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    loadChampionship();
  }, [id]);

  return (
    <section className="admin-page">
      <div className="page-title row-title">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Times do campeonato</h1>
        </div>
        <Link className="text-link" to="/admin/championships">
          Voltar
        </Link>
      </div>

      {loading ? <Loading /> : null}
      {error ? <div className="alert error">{error}</div> : null}

      {!loading && !error ? (
        <div className="content-section">
          <div className="section-heading">
            <div>
              <h2>{championship.name}</h2>
              <p>Temporada {championship.season}</p>
            </div>
            <StatusBadge status={championship.status} />
          </div>
          <div className="empty-state">O vinculo de times entra quando a API liberar esta rota.</div>
        </div>
      ) : null}
    </section>
  );
}

export default ChampionshipTeams;
