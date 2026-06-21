import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Loading from '../../components/Loading.jsx';
import api, { getErrorMessage } from '../../services/api.js';

function Rounds() {
  const { id } = useParams();
  const [championship, setChampionship] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRounds() {
      try {
        const championshipResponse = await api.get(`/championships/${id}`);
        setChampionship(championshipResponse.data);

        try {
          const roundsResponse = await api.get(`/championships/${id}/rounds`);
          setRounds(roundsResponse.data);
        } catch {
          setRounds([]);
        }
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    loadRounds();
  }, [id]);

  function getRoundMatches(round) {
    return round.matches || round.Matches || [];
  }

  function getTeamName(team, fallback) {
    return team?.name || fallback || 'Time';
  }

  return (
    <section className="site-shell page-stack">
      <div className="page-title row-title">
        <div>
          <p className="eyebrow">Rodadas</p>
          <h1>{championship?.name || 'Campeonato'}</h1>
        </div>
        <Link className="text-link" to={`/championships/${id}`}>
          Voltar
        </Link>
      </div>

      {loading ? <Loading /> : null}
      {error ? <div className="alert error">{error}</div> : null}

      {!loading && !error && !rounds.length ? (
        <div className="empty-state">As rodadas serao exibidas quando a rota estiver disponivel.</div>
      ) : null}

      {!loading && !error && rounds.length ? (
        <div className="round-list">
          {rounds.map((round) => {
            const matches = getRoundMatches(round);

            return (
              <article className="round-block" key={round.id}>
                <div className="round-heading">
                  <div>
                    <h2>Rodada {round.number}</h2>
                    <p>{round.type === 'return_leg' ? 'Returno' : 'Turno'}</p>
                  </div>
                  <span>{matches.length} jogo{matches.length === 1 ? '' : 's'}</span>
                </div>

                {matches.length ? (
                  <div className="match-list">
                    {matches.map((match) => (
                      <div className="match-row" key={match.id}>
                        <span>{getTeamName(match.home_team || match.HomeTeam, match.home_team_id)}</span>
                        <strong>
                          {match.home_goals} x {match.away_goals}
                        </strong>
                        <span>{getTeamName(match.away_team || match.AwayTeam, match.away_team_id)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state compact-empty">Nenhuma partida nesta rodada.</div>
                )}
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

export default Rounds;
