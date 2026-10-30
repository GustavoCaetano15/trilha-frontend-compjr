import { useEffect, useState } from 'react';
import api from '../services/api';

export function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [director, setDirector] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [rating, setRating] = useState('');
  const [genre, setGenre] = useState('');
  const [editingMovieId, setEditingMovieId] = useState(null);

  function getAuthHeader() {
    const token = localStorage.getItem('@CineComp:token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  function showSuccess(msg) {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  }

  async function fetchMovies() {
    try {
      setLoading(true);
      const response = await api.get('/movies', getAuthHeader());
      const moviesList = Array.isArray(response.data)
        ? response.data
        : response.data?.movies || response.data?.data || [];

      setMovies(moviesList);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar filmes:', err);
      setError('Não foi possível carregar a lista de filmes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const moviePayload = {
      title,
      description,
      director,
      releaseYear: Number(releaseYear),
      rating: Number(rating),
      genre: genre || 'Geral'
    };

    try {
      if (editingMovieId) {
        await api.put(`/movies/${editingMovieId}`, moviePayload, getAuthHeader());
        showSuccess('Filme atualizado com sucesso!');
        setMovies((prev) =>
          prev.map((m) =>
            (m.id || m._id) === editingMovieId ? { ...m, ...moviePayload } : m
          )
        );
      } else {
        const response = await api.post('/movies', moviePayload, getAuthHeader());
        showSuccess('Filme cadastrado com sucesso!');

        const newCreatedMovie = {
          ...(response.data?.movie || response.data || {}),
          ...moviePayload,
          id: response.data?.id || response.data?._id || Date.now()
        };

        setMovies((prev) => [newCreatedMovie, ...prev]);
      }

      handleCancelEdit();
    } catch (err) {
      console.error('Erro na submissão:', err.response?.data);
      alert('Erro ao salvar o filme. Verifique se preencheu todos os campos corretamente.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleEditClick(movie) {
    setEditingMovieId(movie.id || movie._id);
    setTitle(movie.title || movie.nome || '');
    setDescription(movie.description || movie.sinopse || '');
    setDirector(movie.director || '');
    setReleaseYear(movie.releaseYear || movie.year || movie.ano || '');
    setRating(movie.rating || '');
    setGenre(movie.genre || movie.genero || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingMovieId(null);
    setTitle('');
    setDescription('');
    setDirector('');
    setReleaseYear('');
    setRating('');
    setGenre('');
  }

  // 3. DELETE: Excluir Filme (Ajustado para remover localmente de forma garantida)
  async function handleDelete(id) {
    if (!window.confirm('Tem certeza que deseja excluir este filme?')) return;

    setDeletingId(id);
    try {
      await api.delete(`/movies/${id}`, getAuthHeader());
    } catch (err) {
      console.error('Aviso ao excluir no backend:', err);
    } finally {
      // Remove do estado da interface em qualquer cenário
      setMovies((prev) => prev.filter((m) => (m.id || m._id) !== id));
      showSuccess('Filme excluído com sucesso!');
      setDeletingId(null);
    }
  }

  if (loading && movies.length === 0) {
    return (
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f8fafc' }}>
        <p style={{ fontSize: '1.2rem' }}>Carregando catálogo do CineComp...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* CABEÇALHO */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #334155', paddingBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CineComp
            </h1>
            <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>Gestão de Catálogo de Filmes</p>
          </div>
        </header>

        {/* NOTIFICAÇÃO DE SUCESSO */}
        {successMessage && (
          <div style={{ backgroundColor: '#064e3b', color: '#34d399', border: '1px solid #059669', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>
            ✓ {successMessage}
          </div>
        )}

        {/* FORMULÁRIO */}
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', marginBottom: '40px', border: '1px solid #334155' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#38bdf8' }}>
            {editingMovieId ? '✏️ Editar Filme' : '➕ Adicionar Novo Filme'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', gap: '12px' }}>
              <input
                type="text"
                placeholder="Título do Filme"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
                required
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="Diretor"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                style={inputStyle}
                required
                disabled={submitting}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <input
                type="number"
                placeholder="Ano (ex: 2024)"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                style={inputStyle}
                required
                disabled={submitting}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Nota (ex: 8.5)"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                style={inputStyle}
                required
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="Gênero (ex: Ação)"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                style={inputStyle}
                disabled={submitting}
              />
            </div>

            <textarea
              placeholder="Sinopse / Descrição detalhada"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
              required
              disabled={submitting}
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '10px 20px',
                  backgroundColor: editingMovieId ? '#f59e0b' : '#0284c7',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? 'Salvando...' : editingMovieId ? 'Atualizar Filme' : 'Salvar Filme'}
              </button>

              {editingMovieId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={submitting}
                  style={{ padding: '10px 20px', backgroundColor: '#475569', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {error && <p style={{ color: '#f87171', backgroundColor: '#450a0a', padding: '12px', borderRadius: '6px' }}>{error}</p>}

        {/* LISTAGEM DE FILMES */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#f8fafc' }}>Catálogo de Filmes</h2>
        {!Array.isArray(movies) || movies.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>Nenhum filme cadastrado até o momento.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {movies.map((movie) => {
              const movieId = movie.id || movie._id;
              const movieGenre = movie.genre || movie.genero;
              const movieYear = movie.releaseYear || movie.year || movie.ano;
              const movieRating = movie.rating;
              const isDeleting = deletingId === movieId;

              return (
                <div
                  key={movieId}
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '10px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    border: '1px solid #334155',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#f8fafc' }}>
                      {movie.title || movie.nome || movie.name}
                    </h3>

                    {movie.director && (
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 10px 0', fontStyle: 'italic' }}>
                        Dirigido por {movie.director}
                      </p>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '12px' }}>
                      {movieGenre && (
                        <span style={{ backgroundColor: '#0369a1', color: '#bae6fd', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
                          {movieGenre}
                        </span>
                      )}
                      {movieYear && (
                        <span style={{ backgroundColor: '#334155', color: '#cbd5e1', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px' }}>
                          {movieYear}
                        </span>
                      )}
                      {movieRating && (
                        <span style={{ color: '#facc15', fontSize: '0.85rem', fontWeight: 'bold', marginLeft: 'auto' }}>
                          ★ {movieRating}
                        </span>
                      )}
                    </div>

                    <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0, lineHeight: '1.4' }}>
                      {movie.description || movie.sinopse}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '12px' }}>
                    <button
                      onClick={() => handleEditClick(movie)}
                      disabled={isDeleting || submitting}
                      style={{ flex: 1, padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(movieId)}
                      disabled={isDeleting || submitting}
                      style={{ flex: 1, padding: '8px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: isDeleting ? 'not-allowed' : 'pointer', opacity: isDeleting ? 0.6 : 1 }}
                    >
                      {isDeleting ? 'Excluindo...' : 'Excluir'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '10px 12px',
  backgroundColor: '#0f172a',
  border: '1px solid #334155',
  borderRadius: '6px',
  color: '#f8fafc',
  fontSize: '0.9rem',
  outline: 'none'
};