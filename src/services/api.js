import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Interceptor para adicionar o Token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@CineComp:token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;