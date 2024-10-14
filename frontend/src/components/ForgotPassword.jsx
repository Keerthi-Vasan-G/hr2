import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { toast } from 'react-toastify';
import resetImage from '../assets/images/reset.png'; // Make sure you have this image in the correct path

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/reset-password', formData);
      toast.success('Password has been successfully reset.');

      // Redirect to the login page after successful reset
      setTimeout(() => {
        navigate('/login'); // Redirect to login page
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Failed to reset password. Please try again.');
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
    }
  };

  return (
    <div className="forgot-password-page">
      <a href="/" className="back-to-home">Back to Home</a>
      <div className="forgot-password-container">
        <div className="forgot-password-form">
          <h2>Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="username"
            />
            <input
              type="password"
              name="oldPassword"
              placeholder="Enter your old password"
              value={formData.oldPassword}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm your new password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <button type="submit">Reset Password</button>
          </form>
        </div>
        <div className="forgot-password-image">
          <img src={resetImage} alt="Password Reset Illustration" />
          <h3>Reset Your Password</h3>
          <p>Keep your account secure by updating your password regularly.</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
