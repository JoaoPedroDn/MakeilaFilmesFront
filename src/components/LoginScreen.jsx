import React, { useState } from "react";

function LoginScreen ({onLoginSuccess, onSwitchToRegister}) {
    const [username, setusername] = useState(``);
    const [password, setpassword] = useState(``);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/clientes/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: username,
                    senha: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login bem sucedido. Cliente:", data);
                onLoginSuccess(data);
            } else {
                alert(data.message || 'Usuário ou senha incorretos.');
            }

        } catch (error) {
            console.error('Falha na comunicação com o servidor:', error);
            alert('Não foi possível conectar ao Servidor');
        }
    };

    return (
       <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Makeila Login</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    <input 
                        type="email" 
                        placeholder="E-mail"
                        value={username}
                        onChange={e => setusername(e.target.value)}
                        className="login-input"
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Senha"
                        value={password}
                        onChange={e => setpassword(e.target.value)}
                        className="login-input"
                        required
                    />

                    <button type="Submit" className="login-button">Entrar</button>
                </form>
                <p className="signup-text">
                    Não tem conta? 
                    <a 
                        href="#" 
                        className="signup-link"
                        onClick={(e) => {
                            e.preventDefault();
                            onSwitchToRegister();
                        }}
                        >  Cadastre-se
                    </a>
                </p>
            </div>
       </div>
    );
}

export default LoginScreen;