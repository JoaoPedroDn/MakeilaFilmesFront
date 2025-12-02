import React from "react";
import MovieCard from "./MovieCard";

const NoResultsMessage = ({ searchTerm, selectedCategory }) => {
    let title = "Nada Encontrado 😥";
    let message = "Parece que não há nada aqui...";

    if (searchTerm) {
        title = "Busca Sem Resultados 🔍";
        message = `Ops! Não encontramos nenhum filme com o termo "${searchTerm}".`;
    } else if (selectedCategory === 'Favoritos') {
        title = "Lista de Favoritos Vazia 💔";
        message = "Você ainda não favoritou nenhum filme. Clique no coração para adicionar!";
    } else if (selectedCategory === 'Meus Filmes') {
        title = "Você ainda não tem filmes 🍿";
        message = "Seus filmes comprados aparecerão aqui.";
    } else if (selectedCategory === 'Carrinho') {
        title = "Carrinho Vazio 🛒";
        message = "Adicione filmes para finalizar sua compra.";
    }

    return (
        <div className="main-content placeholder-screen">
            <h1 style={{marginTop: '100px'}}>{title}</h1>
            <p style={{ color: '#aaa', fontSize: '1.1rem' }}>{message}</p>
        </div>
    );
};

function MainContent({ 
    selectedCategory, 
    movies, 
    onAddToCart, 
    searchTerm, 
    ownedMovies = [], 
    onSelectMovie, 
    favoriteMovies,
    onToggleFavorite 
}) {
    
    const listaSegura = Array.isArray(movies) ? movies : [];
    const favoritosSeguros = Array.isArray(favoriteMovies) ? favoriteMovies : [];

    let filteredMovies = listaSegura;
    let title = selectedCategory;

    if (selectedCategory === 'Busca') {
        filteredMovies = listaSegura.filter(movie => 
            (movie.titulo || movie.title || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
        title = `Resultados para: "${searchTerm}"`;
    } 
    else if (selectedCategory === 'Lançamentos') {
        filteredMovies = listaSegura.filter(movie => {
            const movieYear = parseInt(movie.ano || movie.year);
            return movieYear === 2025;
        });
        title = "Lançamentos (2025)"; 
    }
    else if (selectedCategory === 'Meus Filmes') {
        filteredMovies = ownedMovies;
        title = "Minha Biblioteca 🍿";
    } 
    else if (selectedCategory === 'Favoritos') {
        filteredMovies = listaSegura.filter(movie => favoritosSeguros.includes(movie.id));
        title = "Meus Favoritos ❤️";
    }
    else if (selectedCategory !== 'Início' && selectedCategory !== 'Em Alta' && selectedCategory !== 'Lançamentos' && selectedCategory !== 'Carrinho') {
        filteredMovies = listaSegura.filter(movie => {
            const generoFilme = movie.genero || movie.genre || "";
            const generosArray = generoFilme.split(',').map(g => g.trim());
            return generosArray.includes(selectedCategory);
        });
    }

    if (!filteredMovies || filteredMovies.length === 0) {
        return <NoResultsMessage searchTerm={searchTerm} selectedCategory={selectedCategory} />;
    }

    return (
        <div className="main-content">
            <h1>{title}</h1>
            <div className="grid-list">
                {filteredMovies.map(movie => (
                    <MovieCard 
                        key={movie.uniqueId || movie.id}
                        id={movie.id}
                        title={movie.titulo || movie.title || "Sem Título"} 
                        year={movie.ano || movie.year || "2024"}    
                        imageUrl={movie.imagemUrl || movie.imageUrl || "https://via.placeholder.com/300x450?text=Sem+Imagem"} 
                        
                        isFavorite={favoritosSeguros.includes(movie.id)}
                        
                        onToggleFavorite={() => onToggleFavorite(movie.id)}
                        onClick={() => onSelectMovie(movie)}
                    />
                ))}
            </div>
        </div>
    );
}

export default MainContent;