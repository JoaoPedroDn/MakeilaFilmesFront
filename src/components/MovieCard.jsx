import React from "react";

function MovieCard({ id , title, year, imageUrl, isFavorite, onToggleFavorite, onClick }) {

const handlefavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(id);
};

const handleCardClick = () => {
    console.log(`clicou no filme: ${title}`);
}


    return (
        <div 
            className="movie-card" 
            onClick={onClick}
            style={{cursor:`pointer`}}
        >
                <img src={imageUrl} alt={`capa do filme ${title}`} className="movie-poster" />
            <div className="card-info">
                <h3 className="card-title">{title}</h3>
                <p className="card-year">{year}</p>
                <button
                className={`favorite-button ${isFavorite ? `favorited` : ``}`} 
                onClick={handlefavoriteClick} 
                style={{cursor: `pointer`}}>
                    {isFavorite ? '❤️' : '🤍'}
            </button>
        </div>
    </div>
    )
}

export default MovieCard;
