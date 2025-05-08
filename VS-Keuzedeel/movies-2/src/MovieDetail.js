import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_KEY = 'efe1d00e';

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`)
            .then((res) => res.json())
            .then((data) => setMovie(data));
    }, [id]);

    if (!movie) return <p>Loading...</p>;

    return (
        <div className="app">
            <h1>{movie.Title}</h1>
            <img src={movie.Poster} alt={movie.Title} />
            <p><strong>Jaar:</strong> {movie.Year}</p>
            <p><strong>Plot:</strong> {movie.Plot}</p>
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p><strong>Rating:</strong> {movie.imdbRating}</p>
        </div>
    );
}

export default MovieDetail;