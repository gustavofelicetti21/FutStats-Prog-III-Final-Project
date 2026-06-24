import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import DataTable from '../../components/DataTable.jsx';
import Loading from '../../components/Loading.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api, { getErrorMessage } from '../../services/api.js';

function ChampionshipTeams() {
  const { id } = useParams();
  const [championship, setChampionship] = useState(null);
  const [teams, setTeams] = useState([]);
  const [championshipTeams, setChampionshipTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [championshipResponse, teamsResponse, championshipTeamsResponse] = await Promise.all([
          api.get(`/championships/${id}`),
          api.get('/teams'),
          api.get(`/championships/${id}/teams`),
        ]);

        setChampionship(championshipResponse.data);
        setTeams(teamsResponse.data);
        setChampionshipTeams(championshipTeamsResponse.data);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function reloadChampionshipTeams() {
    const response = await api.get(`/championships/${id}/teams`);
    setChampionshipTeams(response.data);
  }

  async function handleAddTeam(event) {
    event.preventDefault();

    if (!selectedTeamId) {
      setError('Selecione um time para adicionar.');
      return;
    }

    setSaving(true);
    setError('');
    setFeedback('');

    try {
      await api.post(`/championships/${id}/teams`, {
        team_id: Number(selectedTeamId),
      });
      setSelectedTeamId('');
      setFeedback('Time adicionado ao campeonato.');
      await reloadChampionshipTeams();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveTeam(team) {
    const confirmed = window.confirm(`Remover ${team.name} deste campeonato?`);

    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError('');
    setFeedback('');

    try {
      await api.delete(`/championships/${id}/teams/${team.id}`);
      setFeedback('Time removido do campeonato.');
      await reloadChampionshipTeams();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  const linkedTeamIds = championshipTeams.map((item) => item.team_id);
  const availableTeams = teams.filter(
    (team) => team.status === 'active' && !linkedTeamIds.includes(team.id),
  );
  const canEditTeams = championship?.status === 'draft';
  const tableRows = championshipTeams.map((item) => ({
    id: item.Team.id,
    name: item.Team.name,
    city: item.Team.city,
    acronym: item.Team.acronym,
    status: item.Team.status,
  }));

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'city', label: 'Cidade' },
    { key: 'acronym', label: 'Sigla' },
    { key: 'status', label: 'Status', render: (team) => <StatusBadge status={team.status} /> },
    {
      key: 'actions',
      label: 'Acoes',
      render: (team) => (
        <div className="table-actions">
          <button
            className="danger-button"
            disabled={!canEditTeams || saving}
            type="button"
            onClick={() => handleRemoveTeam(team)}
          >
            Remover
          </button>
        </div>
      ),
    },
  ];

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
              <p>
                Temporada {championship.season} · {tableRows.length} time
                {tableRows.length === 1 ? '' : 's'}
              </p>
            </div>
            <StatusBadge status={championship.status} />
          </div>

          {canEditTeams ? (
            <form className="inline-form" onSubmit={handleAddTeam}>
              <label className="form-field" htmlFor="team-select">
                <span>Adicionar time</span>
                <select
                  id="team-select"
                  value={selectedTeamId}
                  onChange={(event) => setSelectedTeamId(event.target.value)}
                >
                  <option value="">Selecione um time</option>
                  {availableTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.acronym})
                    </option>
                  ))}
                </select>
              </label>
              <button className="primary-button" disabled={saving || !availableTeams.length} type="submit">
                Adicionar
              </button>
            </form>
          ) : (
            <div className="empty-state compact-empty">
              Times so podem ser alterados enquanto o campeonato estiver em rascunho.
            </div>
          )}

          {error ? (
            <div aria-live="assertive" className="alert error" role="alert">
              {error}
            </div>
          ) : null}
          {feedback ? (
            <div aria-live="polite" className="alert success" role="status">
              {feedback}
            </div>
          ) : null}

          <DataTable
            columns={columns}
            rows={tableRows}
            title="Times vinculados ao campeonato"
            emptyMessage="Nenhum time vinculado a este campeonato."
          />
        </div>
      ) : null}
    </section>
  );
}

export default ChampionshipTeams;
