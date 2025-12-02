import React, { useState } from "react";

function RegisterScreen ({ onRegistrationSuccess, onSwitchToLogin }) {

    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [telephone, setTelephone] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if(password !== confirmpassword) {
            setError("As Senhas São Diferentes, Tente Novamente");
            return;
        }

        const cleanedTelephone = telephone.replace(/\D/g, '');

        if (cleanedTelephone.length < 10) {
             setError("O Telefone deve ter pelo menos 10 dígitos (DDD + Número).");
             return;
        }

       try {
        const response = await fetch('http://localhost:8080/clientes', {
            method: 'POST',
            headers: { 'Content-type': 'application/json'},
            body: JSON.stringify({
                nome: username.split('@')[0],
                email: username,
                telefone: cleanedTelephone,
                senha: password
            })
        });
        
        const data = await response.json();

        if(response.ok) {
            alert('Conta Criada com Sucesso! Faça Login agora.');
            onSwitchToLogin();
        } else {
            setError(data.message || 'Erro ao Registrar. Tente outro E-mail.');
        }
    } catch(erro) {
        console.error('Erro de Conexão:', erro); 
        setError('Falha ao conectar ao Servidor.');
    }
   };

    return (
    <div className="login-container">
        <div className="login-box">
        <h1 className="login-title">Criar uma Conta Makeila</h1>
             <form onSubmit={handleSubmit} className="register-form">
                    <input 
                        type="email" 
                        placeholder="Email"
                        value={username}
                        onChange={e => setusername(e.target.value)}
                        className="login-input"
                        required
                    />
                     <input 
                        type="tel" 
                        placeholder="Telefone"
                        value={telephone}
                        onChange={e => setTelephone(e.target.value)}
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
                    <input 
                        type="password" 
                        placeholder="Confirme sua Senha"
                        value={confirmpassword}
                        onChange={e => setconfirmpassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    

                    <p style={{color : `Red`, marginTop : `10px`}}>{error}</p>

                    <button type="Submit" className="login-button">Criar Conta</button>
                </form>
                <p className="signup-tex">
                    Já tem conta?
                    <button 
                        type="button" 
                        onClick={onSwitchToLogin} 
                        className="signup-link" 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        Faça Login
                    </button>
                </p>
        </div>
    </div>
    );
}

export default RegisterScreen;