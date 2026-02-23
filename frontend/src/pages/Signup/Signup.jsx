import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'designer' });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(formData.email, formData.password, formData.role);
      navigate('/login');
    } catch (err) { alert("Registration failed.", err); }
  };

  return (
    <div className="auth-container">
      <h1>Create Account</h1>
      <form onSubmit={handleSignup}>
        <div className="role-toggle">
          <button type="button" className={formData.role === 'designer' ? 'active' : ''} onClick={() => setFormData({...formData, role: 'designer'})}>Designer</button>
          <button type="button" className={formData.role === 'client' ? 'active' : ''} onClick={() => setFormData({...formData, role: 'client'})}>Client</button>
        </div>
        <div className="input-group">
          <label>Email Address</label>
          <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        </div>
        <button type="submit" className="primary-btn">Join Fashion Link</button>
      </form>
      <p>Already have an account? <Link to="/login">Sign In</Link></p>
    </div>
  );
};
export default Signup;