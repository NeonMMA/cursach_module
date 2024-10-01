import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import ReactDOM from 'react-dom/client';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    localStorage.clear();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
            axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
            const response = await axios.post('http://localhost:5000/login', { username, password });
            localStorage.setItem('accessToken', response.data.access_token);
            localStorage.setItem('refreshToken', response.data.refresh_token);
            console.clear();
            console.log("response:");
            console.log(response);
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
            const err = ReactDOM.createRoot(document.getElementById('err'));
            err.render(<span color='red'>Login failed</span>);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Sign in</h2>
                <div className="divider"></div>
                <div className="input-group">
                    <label htmlFor="username">Username or email address</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username or email address"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <a href="/forgot-password" className="forgot-password">Forgot password?</a>
                </div>
                <button type="submit" className="login-button">Sign in</button>
                <err id="err"/>
                <div className="divider"></div>
            </form>
        </div>
    );
};

export default Login;