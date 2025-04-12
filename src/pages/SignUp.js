import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUpPage = () => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      // Simulate a UID since we’re not using Firebase Auth yet
      const uid = Math.random().toString(36).substring(2, 18);

      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          firstname,
          lastname,
          email,
          balance: 0
        })
      });

      if (response.ok) {
        console.log('✅ User created successfully');
        // Store uid locally to simulate login state (optional)
        localStorage.setItem('uid', uid);
        navigate('/login');
      } else {
        const message = await response.text();
        console.error('❌ Backend error:', message);
        setError(message || 'Failed to create user.');
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-box">
        <h1 className="app-title">Sign Up</h1>
        <form onSubmit={handleSignUp} className="signup-form">
          <div className="input-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default SignUpPage;
