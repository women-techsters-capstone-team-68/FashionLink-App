import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-view">
      <div className="hero-visual">
        <div className="brand-overlay">
          <h1>Fashion Link</h1>
          <p>The OS for African Designers</p>
        </div>
      </div>
      
      <div className="landing-actions">
        <button className="btn-main" onClick={() => navigate('/signup')}>Create Account</button>
        <button className="btn-sub" onClick={() => navigate('/login')}>Sign In</button>
        <div className="divider">or</div>
        <button className="btn-track" onClick={() => navigate('/client/tracking')}>
          Track Your Order
        </button>
      </div>
    </div>
  );
};

export default Landing;