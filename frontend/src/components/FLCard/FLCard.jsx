import React from 'react';
import './FLCard.css';

const FLCard = ({ children, onClick }) => (
  <div className="fl-card" onClick={onClick}>
    {children}
  </div>
);
export default FLCard;