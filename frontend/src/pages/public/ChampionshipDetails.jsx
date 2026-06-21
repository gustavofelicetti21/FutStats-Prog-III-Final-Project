import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Loading from '../../components/Loading.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api, { getErrorMessage } from '../../services/api.js';

const statusDescriptions = {
  draft: 'Campeonato ainda em configuracao.',
  active: 'Campeonato em andamento.',
  finished: 'Campeonato encerrado.',
  deactivated: 'Campeonato fora da area publica.',
};

function ChampionshipDetails() {
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

  if (loading) {
    return (
      <section className="site-shell page-stack">
        <Loading />
      </section>
    );
  }

  if (error) {
    return (
      <section className="site-shell page-stack">
        <div className="alert error">{error}</div>
      </section>
    );
  }

  return (
    <section className="site-shell page-stack">
      <div className="detail-header">
        <div>
          <p className="eyebrow">Campeonato</p>
          <h1>{championship.name}</h1>
          <p>{statusDescriptions[championship.status] || 'Detalhes do campeonato.'}</p>
        </div>
        <StatusBadge status={championship.status} />
      </div>

      <div className="detail-summary">
        <div>
          <span>Temporada</span>
          <strong>{championship.season}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>{championship.status}</strong>
        </div>
        <div>
          <span>Consulta publica</span>
          <strong>Disponivel</strong>
        </div>
      </div>

      <div className="action-grid">
        <Link className="action-card" to={`/championships/${id}/standings`}>
          <strong>Classificacao</strong>
          <span>Tabela calculada pelas partidas finalizadas.</span>
        </Link>
        <Link className="action-card" to={`/championships/${id}/rounds`}>
          <strong>Rodadas</strong>
          <span>Calendario de jogos do campeonato.</span>
        </Link>
        <Link className="action-card" to="/championships">
          <strong>Outros campeonatos</strong>
          <span>Voltar para a lista publica.</span>
        </Link>
      </div>
    </section>
  );
}

export default ChampionshipDetails;
