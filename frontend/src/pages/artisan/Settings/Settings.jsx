import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { LogOut, User, Bell, Shield } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useAuth();

  return (
    <div className="settings-view">
      <h2 className="title">Settings</h2>
      
      <div className="profile-brief">
        <div className="avatar-large">{user?.email?.[0].toUpperCase()}</div>
        <div className="info">
          <h3>{user?.businessName || 'Elite Designer'}</h3>
          <p>{user?.email}</p>
        </div>
      </div>

      <div className="settings-list">
        <div className="setting-item"><User size={20}/> <span>Edit Profile</span></div>
        <div className="setting-item"><Bell size={20}/> <span>Notifications</span></div>
        <div className="setting-item"><Shield size={20}/> <span>Security</span></div>
      </div>

      <button className="logout-button" onClick={logout}>
        <LogOut size={20} />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default Settings;