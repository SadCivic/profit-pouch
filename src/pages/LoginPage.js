import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState(''); // This is email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const normalizedEmail = username.trim().toLowerCase();

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/email/${encodeURIComponent(normalizedEmail)}`
      );

      if (response.ok) {
        const user = await response.json();

        // Simulated password check
        if (password !== 'demo123') {
          setError('Invalid password');
          return;
        }

        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
      } else if (response.status === 404) {
        setError('User not found');
      } else {
        const msg = await response.text();
        setError(msg || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h1 className="app-title">Profit Pouch</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Email</label>
            <input
              type="email"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
          {error && <p className="error-text">{error}</p>}

          <div className="signup-link">
            <Link to="/signup">Don't have an account? Sign up here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
