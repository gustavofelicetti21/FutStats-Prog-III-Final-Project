import axios from 'axios';

import { getToken } from './auth.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getErrorMessage(error) {
  if (!error.response) {
    return 'Nao consegui conectar na API. Confira se o backend esta rodando.';
  }

  const message = error.response.data?.message;

  if (message === 'Invalid credentials') {
    return 'Email ou senha invalidos.';
  }

  if (message === 'Email and password are required') {
    return 'Informe email e senha.';
  }

  return message || 'Nao foi possivel concluir a operacao.';
}

export default api;
