import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import sign from  '../assets/images/sign.png';
const Register = () => {
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', registerData);

      if (response.status === 201) {
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('User already exists. Please log in.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-page">
            <a href="/" className="back-to-home">Back to Home</a> {/* Back to Home Link */}

      <div className="login-container">
        <div className="login-form">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={registerData.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={registerData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={registerData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <button type="submit">Register</button>
            <div className="register-link">
              Already have an account? <a href="/login">Login</a>
            </div>
          </form>
        </div>
        <div className="login-image">
          <img src={sign} alt="" srcset="" />
          <h3>Start Your Journey</h3>
          <p>Register to track and monitor your project activities.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
