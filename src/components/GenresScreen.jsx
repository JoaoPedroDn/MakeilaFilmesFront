import React from 'react';

import acaoposter from "../assets/acao.webp";
import aventuraposter from "../assets/aventura.webp";
import comediaposter from "../assets/comedia.webp";
import dramaposter from "../assets/drama.jpg";
import terrorposter from "../assets/terror.jpg";
import ficcaoposter from "../assets/ficcao.jpg";
import romanceposter from "../assets/romance.jpg";
import animacaoposter from "../assets/animacao.jpg";
import docposter from "../assets/documentario.jpg";
import musicalposter from "../assets/musical.webp";
import suspenseposter from "../assets/suspense.webp";

const MOCK_GENRES = [
    { id: 1, name: "Ação", count: 0, imageUrl: acaoposter },
    { id: 2, name: "Aventura", count: 0, imageUrl: aventuraposter },
    { id: 3, name: "Comédia", count: 0, imageUrl: comediaposter },
    { id: 4, name: "Drama", count: 0, imageUrl: dramaposter },
    { id: 5, name: "Terror", count: 0, imageUrl: terrorposter },
    { id: 6, name: "Ficção Científica", count: 0, imageUrl: ficcaoposter },
    { id: 7, name: "Romance", count: 0, imageUrl: romanceposter  },
    { id: 8, name: "Animação", count: 0, imageUrl: animacaoposter },
    { id: 9, name: "Documentário", count: 0, imageUrl: docposter },
    { id: 10, name: "Musical", count: 0, imageUrl: musicalposter },
    { id: 11, name: "Suspense", count: 0, imageUrl: suspenseposter }
];

function GenresScreen({ onSelectedCategory, allMovies }) {

    const moviesToCount = Array.isArray(allMovies) ? allMovies : [];

    const genreCounts = moviesToCount.reduce((acc, movie) => {
        const generoBruto = movie.genero || movie.genre;
        
        if (generoBruto) {
            const generosDoFilme = generoBruto.split(',');
            
            generosDoFilme.forEach(genero => {
                const nomeLimpo = genero.trim();
                acc[nomeLimpo] = (acc[nomeLimpo] || 0) + 1;
            });
        }
        return acc;
    }, {});

    const FINAL_GENRES = MOCK_GENRES.map(genre => ({
        ...genre,
        count: genreCounts[genre.name] || 0
    }));

    const handleGenreClick = (e, genreName) => {
        if (e && e.currentTarget) e.currentTarget.blur();
        onSelectedCategory(genreName);
    };
    
    return (
        <div className="main-content">
            <h1>Explorar Gêneros</h1>
            <div className="genres-grid">
                {FINAL_GENRES.map(genre => (
                    <button 
                        key={genre.id} 
                        className="genre-tag"
                        onClick={(e) => handleGenreClick(e, genre.name)}
                    >
                        {genre.imageUrl ? (
                             <img src={genre.imageUrl} alt={genre.name} className="genre-image" />
                        ) : (
                             <div className="genre-placeholder">🎬</div>
                        )}
                        <div className="genre-info">
                            <span className="genre-name">{genre.name}</span>
                            <span className="genre-count">({genre.count} filmes)</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default GenresScreen;