import { useEffect, useMemo, useState } from 'react';

import DataTable from '../../components/DataTable.jsx';
import FormInput from '../../components/FormInput.jsx';
import Loading from '../../components/Loading.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api, { getErrorMessage } from '../../services/api.js';

const initialForm = {
  name: '',
  city: '',
  acronym: '',
};

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'deactivated', label: 'Inativos' },
];

function Teams() {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingTeam, setEditingTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  async function loadTeams() {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/teams');
      setTeams(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeams();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleEdit(team) {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      city: team.city,
      acronym: team.acronym,
    });
    setFeedback('');
    setError('');
  }

  function resetForm() {
    setEditingTeam(null);
    setFormData(initialForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setFeedback('');

    try {
      if (editingTeam) {
        await api.put(`/teams/${editingTeam.id}`, formData);
        setFeedback('Time atualizado.');
      } else {
        await api.post('/teams', formData);
        setFeedback('Time cadastrado.');
      }

      resetForm();
      await loadTeams();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(team) {
    const confirmed = window.confirm(`Excluir o time ${team.name}?`);

    if (!confirmed) {
      return;
    }

    setError('');
    setFeedback('');

    try {
      await api.delete(`/teams/${team.id}`);
      setFeedback('Time removido.');
      await loadTeams();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function handleDeactivate(team) {
    const confirmed = window.confirm(`Desativar o time ${team.name}?`);

    if (!confirmed) {
      return;
    }

    setError('');
    setFeedback('');

    try {
      await api.patch(`/teams/${team.id}/deactivate`);
      setFeedback('Time desativado.');
      await loadTeams();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  const visibleTeams = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return teams.filter((team) => {
      const matchesStatus = statusFilter === 'all' || team.status === statusFilter;
      const matchesSearch = [team.name, team.city, team.acronym]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter, teams]);

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
          <button className="secondary-button" type="button" onClick={() => handleEdit(team)}>
            Editar
          </button>
          <button
            className="ghost-button"
            disabled={team.status === 'deactivated'}
            type="button"
            onClick={() => handleDeactivate(team)}
          >
            {team.status === 'deactivated' ? 'Inativo' : 'Desativar'}
          </button>
          <button className="danger-button" type="button" onClick={() => handleDelete(team)}>
            Excluir
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="admin-page two-column">
      <div>
        <div className="page-title">
          <p className="eyebrow">Admin</p>
          <h1>Times</h1>
        </div>

        {loading ? <Loading /> : null}
        {!loading ? (
          <>
            <div className="toolbar-row">
              <label className="search-field" htmlFor="team-search">
                <span>Buscar time</span>
                <input
                  id="team-search"
                  type="search"
                  placeholder="Nome, cidade ou sigla"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </label>

              <div className="segmented-control" aria-label="Filtrar times">
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

              <p className="result-count">
                {visibleTeams.length} time{visibleTeams.length === 1 ? '' : 's'}
              </p>
            </div>

            <DataTable columns={columns} rows={visibleTeams} title="Times cadastrados" />
          </>
        ) : null}
      </div>

      <aside className="side-panel">
        <h2>{editingTeam ? 'Editar time' : 'Novo time'}</h2>
        <form className="form-stack" onSubmit={handleSubmit}>
          <FormInput
            id="team-name"
            label="Nome"
            name="name"
            autoComplete="off"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormInput
            id="team-city"
            label="Cidade"
            name="city"
            autoComplete="address-level2"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <FormInput
            id="team-acronym"
            label="Sigla"
            name="acronym"
            autoComplete="off"
            hint="Use uma sigla curta, como FLA ou CFC."
            value={formData.acronym}
            onChange={handleChange}
            maxLength="5"
            required
          />

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

          <div className="button-row">
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            {editingTeam ? (
              <button className="secondary-button" type="button" onClick={resetForm}>
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
      </aside>
    </section>
  );
}

export default Teams;
