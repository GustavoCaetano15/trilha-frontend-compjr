import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Procura o token em diferentes estruturas possíveis da resposta
    const token = response.data?.token || response.data?.accessToken || response.data?.data?.token;

    if (token) {
      localStorage.setItem('@CineComp:token', token);
      navigate('/movies');
    } else {
      setError('Token não recebido do servidor.');
    }
  } catch (err) {
    console.error('Erro no login:', err);
    setError(err.response?.data?.message || 'Credenciais inválidas. Tenta novamente.');
  } finally {
    setLoading(false);
  }
}

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2>Login - CineComp</h2>
      {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>E-mail:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            placeholder="Ex: marcospaulo@compjunior.com.br"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Palavra-passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}