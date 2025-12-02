import { useState, useEffect } from 'react'
import './App.css'
import MakeilaIcon from './assets/makeila-icon.png'
import lupa from './assets/lupa.png'
import mic from './assets/mic.png'
import sino from './assets/sino.png'
import perfil from './assets/perfil.png'
import Sidebar from "./components/Sidebar.jsx";
import MainContent from './components/MainContent.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import RegisterScreen from './components/RegisterScreen.jsx';
import ShoppingCartScreen from './components/ShoppingCartScreen.jsx';
import CheckoutScreen from './components/CheckoutScreen.jsx';
import MovieDetailScreen from './components/MovieDetailScreen.jsx';
import GenresScreen from './components/GenresScreen.jsx';

function App() {

  const [isLogin, setIsLogin] = useState(true);
  const [currentAuthScreen, setCurrentAuthScreen] = useState('login');
  
  const [selectedCategory, setSelectedCategory] = useState('Início');
  const [searchTerm, setSearchTerm] = useState('');
  const [inputTerm, setInputTerm] = useState('');
  
  const [selectedMovie, setSelectedMovie] = useState(null); 

  const [movies, setMovies] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [ownedMovies, setOwnedMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  
  const [currentClient, setCurrentClient] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/produtos')
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(err => console.error(err));
  }, []);

  const handleLoginSuccess = (clientData) => {
      setCurrentClient(clientData);
      setIsLogin(false);
  };

  const handleLogout = () => {
      setCurrentClient(null);
      setIsLogin(true);
      setCurrentAuthScreen('login');
      setCartItems([]);
      setOwnedMovies([]);
      setFavoriteMovies([]);
      setSelectedCategory('Início');
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedMovie(null);
    setSearchTerm('');
    setInputTerm('');
  };

  const handleAddToCart = (movie, price) => {
    if (cartItems.some(item => item.id === movie.id)) {
        alert("Este filme já está no carrinho!");
        return;
    }
    const itemToAdd = { ...movie, price: price, uniqueId: Date.now() + Math.random() };
    setCartItems([...cartItems, itemToAdd]);
    alert("Filme adicionado ao carrinho!");
  };

  const handleRemoveFromCart = (uniqueId) => {
    setCartItems(cartItems.filter(item => item.uniqueId !== uniqueId));
  };

  const handleProcessPayment = () => {
    setOwnedMovies([...ownedMovies, ...cartItems]);
    setCartItems([]);
    setSelectedCategory('Meus Filmes');
  };

  const handleToggleFavorite = (movieId) => {
    if (favoriteMovies.includes(movieId)) {
        setFavoriteMovies(favoriteMovies.filter(id => id !== movieId));
    } else {
        setFavoriteMovies([...favoriteMovies, movieId]);
    }
  };

  const executeSearch = () => {
      setSearchTerm(inputTerm);
      if(inputTerm) {
          setSelectedCategory('Busca');
          setSelectedMovie(null);
      } else {
          setSelectedCategory('Início');
      }
  };

  const handleInputChange = (e) => {
      setInputTerm(e.target.value);
  };

  if (isLogin) {
      if (currentAuthScreen === 'register') {
          return (
              <RegisterScreen 
                  onSwitchToLogin={() => setCurrentAuthScreen('login')} 
              />
          );
      }
      return (
          <LoginScreen 
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setCurrentAuthScreen('register')}
          />
      );
  }

  return (
    <div className="app-container">
    <header className="top-bar">
        <div className="lado-esquerdo">
            <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                ☰
            </button>
            <div className="logo-area" onClick={() => {setSelectedCategory('Início'); setSelectedMovie(null);}}>
                <img src={MakeilaIcon} alt="Logo" className="makeila-logo-icon" /> 
                <h1 style={{ color: '#e0b400', fontSize: '20px', margin: '0' }}>MAKEILA</h1> 
            </div>
        </div>

        <div className="meio">
            <div className="pesquisa">
                <input 
                    type="text"
                    placeholder='Pesquisar...'
                    className="search-input"
                    value={inputTerm}
                    onChange={handleInputChange} 
                />
                <button className="search-button" onClick={executeSearch}>
                    <img src={lupa} alt="lupa" className="lupa-icon" />
                </button>
            </div>
            <button className="search-voice-button">
                <img src={mic} alt="mic" className="mic-icon" />
            </button> 
        </div>

        <div className="lado-direito">
            <button className="sininho"><img src={sino} alt="sino" className="sino-icon" /></button>
            <button className="perfil"><img src={perfil} alt="perfil" className="perfil-icon" /></button>
            <button className="logout-button" onClick={handleLogout} >Sair</button>
        </div>
    </header>

        <div className={`page-container ${isSidebarOpen ? `sidebar-open` : `sidebar-closed`} `}>
              <Sidebar
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              
              {selectedMovie ? (
                  <MovieDetailScreen 
                      movie={selectedMovie} 
                      onBack={() => setSelectedMovie(null)}
                      onAddToCart={handleAddToCart}
                      isOwned={ownedMovies.some(m => m.id === selectedMovie.id)}
                      price={selectedMovie.price || selectedMovie.preco || 29.90}
                  />
              ) : selectedCategory === 'Carrinho' ? (
                  <ShoppingCartScreen 
                      cartItems={cartItems}
                      onRemoveItem={handleRemoveFromCart}
                      onGoToCheckout={() => setSelectedCategory('Checkout')}
                      onBack={() => setSelectedCategory('Início')}
                  />
              ) : selectedCategory === 'Checkout' ? (
                  <CheckoutScreen 
                      cartItems={cartItems} 
                      onProcessPayment={handleProcessPayment} 
                      onBackToCart={() => setSelectedCategory('Carrinho')}
                      currentClient={currentClient}
                  />
              ) : selectedCategory === 'Gêneros' ? (
                  <GenresScreen 
                    onSelectedCategory={handleCategoryChange} 
                    allMovies={movies}
                  />
              ) : (
                  <MainContent 
                      selectedCategory={selectedCategory}
                      movies={movies}
                      onAddToCart={handleAddToCart}
                      searchTerm={searchTerm}
                      ownedMovies={ownedMovies}
                      onSelectMovie={setSelectedMovie}
                      favoriteMovies={favoriteMovies}
                      onToggleFavorite={handleToggleFavorite}
                  />
              )}
        </div>
    </div>
  )
}

export default App