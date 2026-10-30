import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Movies } from './pages/Movies';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('@CineComp:token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  function handleLogout() {
    localStorage.removeItem('@CineComp:token');
    window.location.href = '/login';
  }

  return (
    <Routes>
      {/* Rota pública de Login */}
      <Route path="/login" element={<Login />} />

      {/* Rota privada de Filmes com Header */}
      <Route
        path="/movies"
        element={
          <PrivateRoute>
            <div>
              <header style={{ padding: '10px 20px', background: '#f4f4f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Sessão Ativa</span>
                <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer' }}>Sair (Logout)</button>
              </header>
              <Movies />
            </div>
          </PrivateRoute>
        }
      />

      {/* Redireciona qualquer URL desconhecida para /movies */}
      <Route path="*" element={<Navigate to="/movies" replace />} />
    </Routes>
  );
}