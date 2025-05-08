import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { Link } from 'react-router-dom';
import './App.css';

const API_KEY = 'efe1d00e';

function Home() {
    const [query, setQuery] = useState('action');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });
    const [year, setYear] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    const isFavorite = (id) => favorites.some((m) => m.imdbID === id);

    const addFavorite = (movie) => {
        const updated = [...favorites, movie];
        setFavorites(updated);
        localStorage.setItem('favorites', JSON.stringify(updated));
    };

    const removeFavorite = (id) => {
        const updated = favorites.filter((m) => m.imdbID !== id);
        setFavorites(updated);
        localStorage.setItem('favorites', JSON.stringify(updated));
    };

    const searchMovies = async (searchText) => {
        if (!searchText) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchText}&y=${year}&type=${type}&page=${page}`);
            const data = await res.json();
            if (data.Response === 'False') {
                setMovies([]);
                setError(data.Error);
            } else {
                setMovies(data.Search);
            }
        } catch (err) {
            setError('Er is iets misgegaan.');
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(debounce(searchMovies, 500), [year, type, page]);

    useEffect(() => {
        if (query) debouncedSearch(query);
    }, [query, debouncedSearch, page]);

    const toggleDarkMode = () => {
        const updated = !darkMode;
        setDarkMode(updated);
        localStorage.setItem('darkMode', updated);
        document.body.className = updated ? 'dark' : '';
    };

    useEffect(() => {
        document.body.className = darkMode ? 'dark' : '';
    }, [darkMode]);

    return (
        <div className="app">
            <h1>🎬 Movie Search App</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Zoek films..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <select onChange={(e) => setYear(e.target.value)} value={year}>
                    <option value="">Alle jaren</option>
                    {[...Array(24)].map((_, i) => (
                        <option key={i} value={2024 - i}>{2024 - i}</option>
                    ))}
                </select>
                <select onChange={(e) => setType(e.target.value)} value={type}>
                    <option value="">Alle types</option>
                    <option value="movie">Film</option>
                    <option value="series">Serie</option>
                </select>
                <select onChange={(e) => setQuery(e.target.value)}>
                    <option value="">Genre kiezen</option>
                    <option value="action">Actie</option>
                    <option value="comedy">Komedie</option>
                    <option value="drama">Drama</option>
                    <option value="horror">Horror</option>
                    <option value="romance">Romantiek</option>
                </select>
                <button onClick={toggleDarkMode}>
                    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading && <p>Loading...</p>}

            <div className="movie-list">
                {movies.map((movie) => (
                    <div className="movie-card" key={movie.imdbID}>
                        <Link to={`/movie/${movie.imdbID}`}>
                            <img
                                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}
                                alt={movie.Title}
                            />
                            <h3>{movie.Title}</h3>
                            <p>{movie.Year}</p>
                        </Link>
                        <button onClick={() =>
                            isFavorite(movie.imdbID)
                                ? removeFavorite(movie.imdbID)
                                : addFavorite(movie)
                        }>
                            {isFavorite(movie.imdbID) ? '💔 Verwijder' : '❤️ Favoriet'}
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                    ◀️ Vorige
                </button>
                <span style={{ margin: '0 10px' }}>Pagina {page}</span>
                <button onClick={() => setPage(page + 1)}>Volgende ▶️</button>
            </div>
        </div>
    );
}

export default Home;