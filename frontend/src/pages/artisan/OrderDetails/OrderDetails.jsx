import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="details-page">
      <button onClick={() => navigate(-1)} className="back-btn"><ArrowLeft size={20}/> Back</button>
      <div className="order-header">
        <h1>Order #{id?.slice(0, 5) || '1024'}</h1>
        <span className="status-badge">In Progress</span>
      </div>

      <section className="section">
        <h3>Measurements</h3>
        <div className="meas-grid">
          <div className="meas-item"><span>Chest</span><strong>38"</strong></div>
          <div className="meas-item"><span>Waist</span><strong>32"</strong></div>
          <div className="meas-item"><span>Length</span><strong>45"</strong></div>
        </div>
      </section>

      <section className="section">
        <h3>Timeline</h3>
        <div className="timeline">
          <div className="step done"><CheckCircle size={16}/> Order Received</div>
          <div className="step active"><div className="dot"></div> Cutting & Sewing</div>
          <div className="step">Fine Tuning</div>
        </div>
      </section>
    </div>
  );
};
export default OrderDetails;