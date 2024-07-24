// Login.js
import React, { useState } from 'react';
import authService from '../services/authService';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await authService.login({ username, password });
            setError(null);
            history.push('/dashboard/'); // Redirige al dashboard después del inicio de sesión exitoso
        } catch (error) {
            setError('Nombre de usuario o contraseña incorrectos.');
            console.error('Error durante el inicio de sesión:', error);
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Iniciar Sesión</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
