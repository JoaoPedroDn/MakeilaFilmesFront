import React from "react";

function ShoppingCartScreen({ cartItems, onRemoveItem, onGoToCheckout, onBack }) {
    
    const total = cartItems.reduce((acc, item) => {
        
        const itemPrice = item.price || item.preco || 29.90;
        
        const numericPrice = typeof itemPrice === 'number' ? itemPrice : parseFloat(itemPrice);

        const finalPrice = isNaN(numericPrice) ? 29.90 : numericPrice;

        return acc + finalPrice;
    }, 0);

    return (
        <div className="main-content">
            <h1 style={{ color: '#e0b400', marginBottom: '20px' }}>🛒 Seu Carrinho</h1>
            
            <button className="back-button" onClick={onBack}>
                ← Continuar Comprando
            </button>

            <div className="cart-items">
                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                        <h2>Seu carrinho está vazio 😢</h2>
                        <p>Volte para a loja e adicione alguns filmes incríveis!</p>
                    </div>
                ) : (
                    <ul>
                        {cartItems.map((item, index) => {
                            const itemId = item.uniqueId;
                            
                            return (
                                <li key={itemId} className="cart-item-container">
                                    <div className="cart-item-detail"> 
                                        <img 
                                            src={item.imageUrl || item.imagemUrl || "https://via.placeholder.com/50"} 
                                            alt="poster" 
                                            style={{ width: '50px', height: '75px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }}
                                        />
                                        <div>
                                            <span className="cart-item-title" style={{ display: 'block', color: 'white' }}>
                                                {item.title || item.titulo}
                                            </span>
                                            <span className="cart-item-price" style={{ color: '#e0b400', fontWeight: 'bold' }}>
                                                R$ {(item.price || item.preco || 29.90).toFixed(2).replace('.', ',')}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => onRemoveItem(itemId)}
                                        className="remove-item-button"
                                    >
                                        🗑️ Remover
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {cartItems.length > 0 && (
                <div style={{ marginTop: '30px', borderTop: '1px solid #333', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <span style={{ fontSize: '1.2rem' }}>Total do Pedido:</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e0b400' }}>
                            R$ {total.toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                    
                    <button
                        className="checkout-button"
                        onClick={onGoToCheckout}
                    >
                        Ir para Pagamento 💳
                    </button>
                </div>
            )}
        </div>
    );
}

export default ShoppingCartScreen;