import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('@CineComp:token');

  function handleLogout() {
    localStorage.removeItem('@CineComp:token');
    navigate('/login');
  }

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <h1 style={{ margin: 0, fontSize: '20px', cursor: 'pointer' }} onClick={() => navigate('/movies')}>
        🎬 CineComp
      </h1>

      {token && (
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e50914',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Sair (Logout)
        </button>
      )}
    </header>
  );
}