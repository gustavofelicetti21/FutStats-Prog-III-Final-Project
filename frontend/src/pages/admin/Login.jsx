import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import FormInput from '../../components/FormInput.jsx';
import api, { getErrorMessage } from '../../services/api.js';
import { isAuthenticated, saveSession } from '../../services/auth.js';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      saveSession(response.data);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="page-title">
          <p className="eyebrow">Area administrativa</p>
          <h1>Entrar no FutStats</h1>
          <p>Use sua conta de administrador para gerenciar times e campeonatos.</p>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <FormInput
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormInput
            id="password"
            label="Senha"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error ? (
            <div aria-live="assertive" className="alert error" role="alert">
              {error}
            </div>
          ) : null}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
