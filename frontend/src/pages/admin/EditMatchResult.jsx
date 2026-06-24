import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import FormInput from '../../components/FormInput.jsx';
import Loading from '../../components/Loading.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api, { getErrorMessage } from '../../services/api.js';

function EditMatchResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [formData, setFormData] = useState({
    home_goals: '0',
    away_goals: '0',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMatch() {
      try {
        const response = await api.get(`/matches/${id}`);
        setMatch(response.data);
        setFormData({
          home_goals: String(response.data.home_goals ?? 0),
          away_goals: String(response.data.away_goals ?? 0),
        });
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    loadMatch();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.patch(`/matches/${id}/result`, {
        home_goals: Number(formData.home_goals),
        away_goals: Number(formData.away_goals),
      });
      navigate('/admin/matches');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-page">
      <div className="page-title row-title">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Editar resultado</h1>
        </div>
        <Link className="text-link" to="/admin/matches">
          Voltar
        </Link>
      </div>

      {loading ? <Loading /> : null}

      {!loading && match ? (
        <div className="content-section result-panel">
          <div className="section-heading">
            <div>
              <h2>Partida #{match.id}</h2>
              <p>
                {match.HomeTeam?.name || match.home_team_id} x{' '}
                {match.AwayTeam?.name || match.away_team_id} · Rodada {match.round_id}
              </p>
            </div>
            <StatusBadge status={match.status} />
          </div>

          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="score-form-grid">
              <FormInput
                id="home-goals"
                label="Gols mandante"
                min="0"
                name="home_goals"
                type="number"
                value={formData.home_goals}
                onChange={handleChange}
                required
              />
              <FormInput
                id="away-goals"
                label="Gols visitante"
                min="0"
                name="away_goals"
                type="number"
                value={formData.away_goals}
                onChange={handleChange}
                required
              />
            </div>

            {error ? (
              <div aria-live="assertive" className="alert error" role="alert">
                {error}
              </div>
            ) : null}

            <button className="primary-button" disabled={saving} type="submit">
              {saving ? 'Salvando...' : 'Salvar resultado'}
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}

export default EditMatchResult;
