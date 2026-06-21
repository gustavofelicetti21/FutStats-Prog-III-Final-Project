import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import DataTable from '../../components/DataTable.jsx';
import FormInput from '../../components/FormInput.jsx';
import Loading from '../../components/Loading.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api, { getErrorMessage } from '../../services/api.js';

const initialForm = {
  name: '',
  season: '',
  status: 'draft',
};

function ChampionshipsAdmin() {
  const [championships, setChampionships] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingChampionship, setEditingChampionship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  async function loadChampionships() {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/championships');
      setChampionships(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChampionships();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleEdit(championship) {
    setEditingChampionship(championship);
    setFormData({
      name: championship.name,
      season: championship.season,
      status: championship.status,
    });
    setFeedback('');
    setError('');
  }

  function resetForm() {
    setEditingChampionship(null);
    setFormData(initialForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setFeedback('');

    try {
      if (editingChampionship) {
        await api.put(`/championships/${editingChampionship.id}`, formData);
        setFeedback('Campeonato atualizado.');
      } else {
        await api.post('/championships', {
          name: formData.name,
          season: formData.season,
        });
        setFeedback('Campeonato cadastrado.');
      }

      resetForm();
      await loadChampionships();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(championship) {
    const confirmed = window.confirm(`Excluir o campeonato ${championship.name}?`);

    if (!confirmed) {
      return;
    }

    setError('');
    setFeedback('');

    try {
      await api.delete(`/championships/${championship.id}`);
      setFeedback('Campeonato removido.');
      await loadChampionships();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function handleDeactivate(championship) {
    const confirmed = window.confirm(`Desativar o campeonato ${championship.name}?`);

    if (!confirmed) {
      return;
    }

    setError('');
    setFeedback('');

    try {
      await api.patch(`/championships/${championship.id}/deactivate`);
      setFeedback('Campeonato desativado.');
      await loadChampionships();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'season', label: 'Temporada' },
    {
      key: 'status',
      label: 'Status',
      render: (championship) => <StatusBadge status={championship.status} />,
    },
    {
      key: 'actions',
      label: 'Acoes',
      render: (championship) => (
        <div className="table-actions">
          <Link className="secondary-button" to={`/admin/championships/${championship.id}/teams`}>
            Times
          </Link>
          <button
            className="secondary-button"
            type="button"
            onClick={() => handleEdit(championship)}
          >
            Editar
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => handleDeactivate(championship)}
          >
            Desativar
          </button>
          <button
            className="danger-button"
            type="button"
            onClick={() => handleDelete(championship)}
          >
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
          <h1>Campeonatos</h1>
        </div>

        {loading ? <Loading /> : null}
        {!loading ? <DataTable columns={columns} rows={championships} /> : null}
      </div>

      <aside className="side-panel">
        <h2>{editingChampionship ? 'Editar campeonato' : 'Novo campeonato'}</h2>
        <form className="form-stack" onSubmit={handleSubmit}>
          <FormInput
            id="championship-name"
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormInput
            id="championship-season"
            label="Temporada"
            name="season"
            value={formData.season}
            onChange={handleChange}
            required
          />
          {editingChampionship ? (
            <label className="form-field" htmlFor="championship-status">
              <span>Status</span>
              <select
                id="championship-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Rascunho</option>
                <option value="active">Ativo</option>
                <option value="finished">Finalizado</option>
                <option value="deactivated">Inativo</option>
              </select>
            </label>
          ) : null}

          {error ? <div className="alert error">{error}</div> : null}
          {feedback ? <div className="alert success">{feedback}</div> : null}

          <div className="button-row">
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            {editingChampionship ? (
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

export default ChampionshipsAdmin;
