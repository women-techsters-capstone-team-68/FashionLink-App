import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import './App.css';

/* ── Layouts ────────────────────────────────────────────────── */
import ArtisanLayout from "./layouts/ArtisanLayout/ArtisanLayout.jsx";
import ClientLayout  from "./layouts/ClientLayout/ClientLayout.jsx";

/* ── Marketing & Auth Pages ─────────────────────────────────── */
import HomePage           from "./pages/marketing/HomePage.jsx";
import LandingPage        from "./pages/Landing/LandingPage.jsx";
import SignupPage         from "./pages/auth/SignupPage.jsx";
import LoginPage          from "./pages/auth/LoginPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import CheckEmailPage     from "./pages/auth/CheckEmailPage.jsx";

/* ── Artisan Pages ──────────────────────────────────────────── */
import Dashboard      from "./pages/artisan/Dashboard/Dashboard.jsx";
import Orders         from "./pages/artisan/Orders/Orders.jsx";
import OrderDetails   from "./pages/artisan/OrderDetails/OrderDetails.jsx";
import NewOrder       from "./pages/artisan/NewOrder/NewOrder.jsx";
import Clients        from "./pages/artisan/Clients/Clients.jsx";
import ClientProfile  from "./pages/artisan/ClientProfile/ClientProfile.jsx";
import AddClient      from "./pages/artisan/AddClients/AddClient.jsx";
import ArtisanNetwork from "./pages/artisan/ArtisanNetwork/ArtisanNetwork.jsx";
import ArtisanProfile from "./pages/artisan/ArtisanProfile/ArtisanProfile.jsx";
import ComingSoon     from "./pages/artisan/ComingSoon/ComingSoon.jsx";
import Notifications  from "./pages/artisan/Notifications/Notifications.jsx";
import Settings       from "./pages/artisan/Settings/Settings.jsx";

/* ── Client Pages ───────────────────────────────────────────── */
import ClientDashboard     from './pages/client/Dashboard/Dashboard.jsx';
import MyOrders            from './pages/client/MyOrders/MyOrders.jsx';
import Messages            from './pages/client/Messages/Messages.jsx';
import ClientNotifications from './pages/client/Notifications/Notifications.jsx';
import Profile             from './pages/client/Profile/Profile.jsx';

/* ── Route Guards ────────────────────────────────────────────── */

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  if (role && user.role !== role) {
    /* Redirect to user's correct dashboard if they try to access wrong portal */
    return <Navigate to={user.role === "artisan" ? "/artisan/dashboard" : "/client/dashboard"} replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === "artisan" ? "/artisan/dashboard" : "/client/dashboard"} replace />;
  }
  return children;
}

/* ── Router ──────────────────────────────────────────────────── */

function AppRoutes() {
  const [gender, setGender] = useState('female');

  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route path="/"                element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
      <Route path="/home"            element={<HomePage />} />
      <Route path="/signup"          element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
      <Route path="/login"           element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
      <Route path="/check-email"     element={<CheckEmailPage />} />

      {/* ── Artisan Portal ── */}
      <Route path="/artisan/dashboard"     element={<ProtectedRoute role="artisan"><ArtisanLayout><Dashboard /></ArtisanLayout></ProtectedRoute>} />
      <Route path="/artisan/orders"        element={<ProtectedRoute role="artisan"><ArtisanLayout><Orders /></ArtisanLayout></ProtectedRoute>} />
      <Route path="/artisan/orders/:id"    element={<ProtectedRoute role="artisan"><ArtisanLayout><OrderDetails /></ArtisanLayout></ProtectedRoute>} />
      <Route path="/artisan/add-order"     element={<ProtectedRoute role="artisan"><ArtisanLayout><NewOrder /></ArtisanLayout></ProtectedRoute>} />
      <Route path="/artisan/clients"       element={<ProtectedRoute role="artisan"><ArtisanLayout><Clients /></ArtisanLayout></ProtectedRoute>} />
      <Route path="/artisan/clients/add"   element={<ProtectedRoute role="artisan"><ArtisanLayout><AddClient /></ArtisanLayout></ProtectedRoute>} />
      <Route path="/artisan/clients/:id"   element={<ProtectedRoute role="artisan"><ArtisanLayout><ClientProfile /></ArtisanLayout></ProtectedRoute>} />
      <Route path="/artisan/network"       element={<ProtectedRoute role="artisan"><ArtisanLayout><ArtisanNetwork /></ArtisanLayout></ProtectedRoute>} />
      <Route path="/artisan/network/:id"   element={<ProtectedRoute role="artisan"><ArtisanLayout><ArtisanProfile /></ArtisanLayout></ProtectedRoute>} />
      <Route path="/artisan/coming-soon"   element={<ProtectedRoute role="artisan"><ArtisanLayout><ComingSoon /></ArtisanLayout></ProtectedRoute>} />
      <Route path="/artisan/notifications" element={<ProtectedRoute role="artisan"><ArtisanLayout><Notifications /></ArtisanLayout></ProtectedRoute>} />
      <Route path="/artisan/settings"      element={<ProtectedRoute role="artisan"><ArtisanLayout><Settings /></ArtisanLayout></ProtectedRoute>} />

      {/* ── Client Portal ── */}
      <Route path="/client/dashboard"     element={<ProtectedRoute role="client"><ClientLayout><ClientDashboard /></ClientLayout></ProtectedRoute>} />
      <Route path="/client/orders"        element={<ProtectedRoute role="client"><ClientLayout><MyOrders /></ClientLayout></ProtectedRoute>} />
      <Route path="/client/messages"      element={<ProtectedRoute role="client"><ClientLayout><Messages /></ClientLayout></ProtectedRoute>} />
      <Route path="/client/notifications" element={<ProtectedRoute role="client"><ClientLayout><ClientNotifications /></ClientLayout></ProtectedRoute>} />
      <Route path="/client/profile" element={
        <ProtectedRoute role="client">
          <ClientLayout>
            <Profile gender={gender} setGender={setGender} />
          </ClientLayout>
        </ProtectedRoute>
      } />

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}