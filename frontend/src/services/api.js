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

  const translatedMessages = {
    'Cannot add a deactivated team to a championship':
      'Nao e possivel adicionar um time inativo ao campeonato.',
    'Championship must have at least two teams to generate rounds':
      'Adicione pelo menos dois times antes de gerar as rodadas.',
    'Championship teams can only be changed while championship is in draft status':
      'Os times so podem ser alterados enquanto o campeonato estiver em rascunho.',
    'Home goals cannot be negative': 'Os gols do mandante nao podem ser negativos.',
    'Home goals is required': 'Informe os gols do mandante.',
    'Home goals must be an integer': 'Os gols do mandante devem ser um numero inteiro.',
    'Rounds already generated for this championship': 'As rodadas deste campeonato ja foram geradas.',
    'Rounds can only be generated while championship is in draft status':
      'As rodadas so podem ser geradas enquanto o campeonato estiver em rascunho.',
    'Team already linked to this championship': 'Este time ja esta vinculado ao campeonato.',
    'Team is required': 'Selecione um time.',
    'Team is not linked to this championship': 'Este time nao esta vinculado ao campeonato.',
    'Away goals cannot be negative': 'Os gols do visitante nao podem ser negativos.',
    'Away goals is required': 'Informe os gols do visitante.',
    'Away goals must be an integer': 'Os gols do visitante devem ser um numero inteiro.',
  };

  if (translatedMessages[message]) {
    return translatedMessages[message];
  }

  return message || 'Nao foi possivel concluir a operacao.';
}

export default api;
