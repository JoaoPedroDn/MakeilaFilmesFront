import React from "react";

const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;

    try {
        const shortUrlMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        if(shortUrlMatch && shortUrlMatch[1]) videoId = shortUrlMatch[1];

        const longUrlMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
        if(!videoId && longUrlMatch && longUrlMatch[1]) videoId = longUrlMatch[1];
    } catch (e) {
        return null;
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

function MovieDetailScreen({ movie, onBack, onAddToCart, isOwned, price }) {
    
    if (!movie) {
        return (
            <div className="main-content">
                <h2>Carregando detalhes...</h2>
                <button className="back-button" onClick={onBack}>← Voltar</button>
            </div>
        );
    }

    const titulo = movie.titulo || movie.title || "Sem Título";
    const sinopse = movie.sinopse || movie.synopsis || "Sinopse indisponível.";
    const elenco = movie.elenco || movie.cast || "Elenco não informado.";
    const imagem = movie.imagemUrl || movie.imageUrl || "https://via.placeholder.com/300";
    const trailer = movie.trailerUrl || "";
    const ano = movie.ano || movie.year || "";
    const genero = movie.genero || movie.genre || "";
    
    const precoFinal = (typeof price === 'number') ? price : (movie.preco || 29.90);

    const finalTrailerSrc = getYoutubeEmbedUrl(trailer);

    return (
        <div className="main-content">
            <button className="back-button" onClick={onBack} style={{marginBottom: '20px'}}>
                ← Voltar
            </button>

            <div className="detail-container">
                <div className="poster-wrapper">
                    <img src={imagem} alt={titulo} className="detail-poster" />
                </div>
                <div className="detail-info">
                    <h1>{titulo}</h1>
                    
                    <div style={{color: '#aaa', marginBottom: '15px'}}>
                        {ano && <span>{ano} • </span>}
                        {genero && <span>{genero}</span>}
                    </div>

                    <div className="detail-synopsis">
                        <h2>Sinopse</h2>
                        <p>{sinopse}</p>
                    </div>
                    
                    <hr />
                    
                    {isOwned ? (
                        <button className="watch-button">
                            ▶ Assistir Agora
                        </button>
                    ) : (
                        <button
                        className="buy-button"
                        onClick={() => onAddToCart(movie, precoFinal)}
                        >
                            Comprar por R$ {precoFinal.toFixed(2)} 🛒
                        </button>
                    )}
                </div>
            </div>

            {finalTrailerSrc && (
                <div className="trailer-section">
                    <h2>Trailer</h2>
                    <div className="trailer-embed-container">
                        <iframe 
                            src={finalTrailerSrc}
                            title={`Trailer de ${titulo}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <hr />
                </div>
            )}

            <div className="detail-cast">
                <h2>Elenco</h2>
                <p>{elenco}</p>
            </div>
        </div>
    );
}

export default MovieDetailScreen;