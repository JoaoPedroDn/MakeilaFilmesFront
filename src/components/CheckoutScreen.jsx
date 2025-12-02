import React, { useState } from "react";

function CheckoutScreen({ cartItems, onProcessPayment, onBackToCart, currentClient }) {
    
    const [paymentMethod, setPaymentMethod] = useState('CreditCard'); 
    
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    
    const [pixKey, setPixKey] = useState(currentClient?.email || '');

    const [isLoading, setIsLoading] = useState(false);

    const total = cartItems.reduce((acc, item) => {
        const itemPrice = item.price || item.preco || 29.90;
        const numericPrice = typeof itemPrice === 'number' ? itemPrice : parseFloat(itemPrice);
        const finalPrice = isNaN(numericPrice) ? 29.90 : numericPrice;
        return acc + finalPrice;
    }, 0);

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!currentClient) {
            alert("Erro: Você precisa estar logado para finalizar a compra.");
            return;
        }

        setIsLoading(true);

        try {
            const respPedido = await fetch('http://localhost:8080/api/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentClient) 
            });

            if (!respPedido.ok) throw new Error("Falha ao criar pedido inicial.");
            const pedidoCriado = await respPedido.json();
            const idPedido = pedidoCriado.id;

            for (const item of cartItems) {
                await fetch(`http://localhost:8080/api/pedidos/${idPedido}/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: item.id })
                });
            }

            let urlPagamento = '';
            let bodyPagamento = {};
            let isPostParam = false;

            if (paymentMethod === 'Pix') {
                urlPagamento = `http://localhost:8080/api/pedidos/${idPedido}/pagar/pix`;
                bodyPagamento = { chavePix: pixKey };
            } 
            else if (paymentMethod === 'CreditCard') {
                urlPagamento = `http://localhost:8080/api/pedidos/${idPedido}/pagar/cartao/credito?numero=${cardNumber}`;
                isPostParam = true;
            } 
            else if (paymentMethod === 'DebitCard') {
                urlPagamento = `http://localhost:8080/api/pedidos/${idPedido}/pagar/cartao/debito?numero=${cardNumber}`;
                isPostParam = true;
            }

            const options = {
                method: 'POST',
                headers: isPostParam ? {} : { 'Content-Type': 'application/json' }
            };

            if (!isPostParam) {
                options.body = JSON.stringify(bodyPagamento);
            }

            const respPagamento = await fetch(urlPagamento, options);

            if (respPagamento.ok) {
                const textoSucesso = await respPagamento.text();
                alert(`✅ ${textoSucesso}`);
                onProcessPayment();
            } else {
                const textoErro = await respPagamento.text();
                alert(`❌ Pagamento Recusado: ${textoErro}`);
            }

        } catch (error) {
            console.error(error);
            alert("Ocorreu um erro ao processar sua compra. Verifique o servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="main-content">
            <button className="back-button" onClick={onBackToCart}>
                ← Voltar ao Carrinho
            </button>
            
            <div className="checkout-container">
                <h1 style={{ color: '#e0b400', marginBottom: '20px' }}>Finalizar Compra</h1>

                <div className="checkout-grid">
                    <div className="left-column">
                        <div className="summary-card">
                            <h3>Resumo do Pedido</h3>
                            <p>Itens: {cartItems.length}</p>
                            <div className="total-price">
                                R$ {total.toFixed(2).replace('.', ',')}
                            </div>
                        </div>
                    </div>

                    <div className="payment-section">
                        <div className="payment-tabs">
                            <div 
                                className={`payment-tab ${paymentMethod === 'CreditCard' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('CreditCard')}
                            >
                                💳 Crédito
                            </div>
                            <div 
                                className={`payment-tab ${paymentMethod === 'DebitCard' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('DebitCard')}
                            >
                                🏧 Débito
                            </div>
                            <div 
                                className={`payment-tab ${paymentMethod === 'Pix' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('Pix')}
                            >
                                💠 PIX
                            </div>
                        </div>

                        {(paymentMethod === 'CreditCard' || paymentMethod === 'DebitCard') && (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Nome no Cartão</label>
                                    <input 
                                        type="text" 
                                        className="checkout-input"
                                        value={cardName} 
                                        onChange={e => setCardName(e.target.value)} 
                                        required 
                                        placeholder="Como impresso no cartão"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Número do Cartão</label>
                                    <input 
                                        type="text" 
                                        className="checkout-input"
                                        value={cardNumber} 
                                        onChange={e => setCardNumber(e.target.value)} 
                                        maxLength="19"
                                        placeholder="0000 0000 0000 0000"
                                        required 
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Validade</label>
                                        <input 
                                            type="text" 
                                            className="checkout-input"
                                            placeholder="MM/AA" 
                                            value={cardExpiry}
                                            onChange={e => setCardExpiry(e.target.value)}
                                            required
                                            maxLength="5"
                                        />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>CVV</label>
                                        <input 
                                            type="text" 
                                            className="checkout-input"
                                            placeholder="123" 
                                            maxLength="3"
                                            value={cardCvv}
                                            onChange={e => setCardCvv(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="checkout-button" 
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Processando..." : `Pagar com ${paymentMethod === 'CreditCard' ? 'Crédito' : 'Débito'}`}
                                </button>
                            </form>
                        )}

                        {paymentMethod === 'Pix' && (
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: '#ccc', marginBottom: '15px' }}>
                                    Informe sua chave PIX ou use o QR Code gerado abaixo.
                                </p>
                                <input 
                                    type="text" 
                                    className="checkout-input"
                                    placeholder="E-mail, CPF ou Aleatória"
                                    value={pixKey}
                                    onChange={e => setPixKey(e.target.value)}
                                    style={{ marginBottom: '20px' }}
                                />
                                
                                <div style={{ 
                                    width: '180px', 
                                    height: '180px', 
                                    background: 'white', 
                                    margin: '0 auto', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    borderRadius: '10px'
                                }}>
                                    <strong style={{ color: '#000' }}>QR CODE</strong>
                                </div>

                                <button 
                                    type="button" 
                                    onClick={handleSubmit} 
                                    className="checkout-button" 
                                    style={{ background: '#00c65e', color: '#fff', marginTop: '20px' }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Validando..." : "✅ Confirmar Pagamento PIX"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutScreen;