import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import login from '../assets/images/login.png';

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', loginData);
      toast.success(`Welcome, ${response.data.user.username}!`);
      navigate('/dashboard', { state: { user: response.data.user } });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Invalid credentials. Please try again.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-page">
      <a href="/" className="back-to-home">Back to Home</a> {/* Back to Home Link */}
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={handleChange}
              required
              autoComplete="username"
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <button type="submit">Login</button>
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <div className="register-link">
              Don’t have an account? <Link to="/register">Sign up</Link>
            </div>
          </form>
        </div>
        <div className="login-image">
          <img src={login} alt="Login Illustration" />
          <h3>Check Your Project Progress</h3>
          <p>Track and monitor your project activities and growth.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
