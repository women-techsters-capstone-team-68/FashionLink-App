import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Layouts
import ArtisanLayout from "./layouts/ArtisanLayout/ArtisanLayout";

// Pages
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Dashboard from "./pages/artisan/Dashboard/Dashboard";
import Orders from "./pages/artisan/Orders/Orders";
import OrderDetails from "./pages/artisan/OrderDetails/OrderDetails";


import Clients from "./pages/artisan/Clients/Client"; 
import Settings from "./pages/artisan/Settings/Settings";
import ClientTracking from "./pages/client/ClientTracking/ClientTracking";
import ClientDashboard from "./pages/client/ClientDashboard/ClientDashboard";

import './App.css';

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loader">Loading...</div>;
  if (user) {
    return <Navigate to={user.role === 'designer' ? '/artisan/dashboard' : '/client/tracking'} replace />;
  }
  return <Landing />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Artisan Module */}
          <Route path="/artisan" element={
            <ProtectedRoute allowedRole="designer">
              <ArtisanLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="clients" element={<Clients />} /> 
            <Route path="settings" element={<Settings />} /> 
          </Route>

          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/tracking" element={<ClientTracking />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;