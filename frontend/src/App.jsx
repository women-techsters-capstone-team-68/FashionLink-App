import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth }  from "./context/AuthContext.jsx";

/* Marketing */
import HomePage             from "./pages/marketing/HomePage.jsx";

/* Auth pages */
import LandingPage          from "./pages/landing/LandingPage.jsx";
import SignupPage           from "./pages/auth/SignupPage.jsx";
import LoginPage            from "./pages/auth/LoginPage.jsx";
import ForgotPasswordPage   from "./pages/auth/ForgotPasswordPage.jsx";
import CheckEmailPage       from "./pages/auth/CheckEmailPage.jsx";

/* Artisan pages */
import ArtisanLayout from "./layouts/ArtisanLayout/ArtisanLayout.jsx";
import Dashboard     from "./pages/artisan/Dashboard/Dashboard.jsx";
import Orders        from "./pages/artisan/Orders/Orders.jsx";
import OrderDetails  from "./pages/artisan/OrderDetails/OrderDetails.jsx";
import NewOrder      from "./pages/artisan/NewOrder/NewOrder.jsx";
import Clients       from "./pages/artisan/Clients/Clients.jsx";
import ClientProfile from "./pages/artisan/ClientProfile/ClientProfile.jsx";
import AddClient     from "./pages/artisan/AddClients/AddClient.jsx";

/* Client pages */
import ClientDashboard from "./pages/client/Dashboard/ClientDashboard.jsx";

/* Route guards */

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    /* Wrong role — send to their own dashboard */
    return <Navigate to={user.role === "artisan" ? "/artisan/dashboard" : "/client/dashboard"} replace />;
  }
  return children;
}

/**
 * PublicOnlyRoute — redirects logged-in users away from auth pages.
 */
function PublicOnlyRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === "artisan" ? "/artisan/dashboard" : "/client/dashboard"} replace />;
  }
  return children;
}

/* Artisan layout wrapper */
function ArtisanPage({ children }) {
  return (
    <ProtectedRoute role="artisan">
      <ArtisanLayout>{children}</ArtisanLayout>
    </ProtectedRoute>
  );
}

/* ── Router ───────────────────────────────────────────────────── */
function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ──────────────────────────────────────────── */}
      <Route path="/"                element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
      <Route path="/home"            element={<HomePage />} />
      <Route path="/signup"          element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
      <Route path="/login"           element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
      <Route path="/check-email"     element={<CheckEmailPage />} />

      {/* ── Artisan portal ──────────────────────────────────── */}
      <Route path="/artisan/dashboard"    element={<ArtisanPage><Dashboard /></ArtisanPage>} />
      <Route path="/artisan/orders"       element={<ArtisanPage><Orders /></ArtisanPage>} />
      <Route path="/artisan/orders/:id"   element={<ArtisanPage><OrderDetails /></ArtisanPage>} />
      <Route path="/artisan/add-order"    element={<ArtisanPage><NewOrder /></ArtisanPage>} />
      <Route path="/artisan/clients"      element={<ArtisanPage><Clients /></ArtisanPage>} />
      <Route path="/artisan/clients/add"  element={<ArtisanPage><AddClient /></ArtisanPage>} />
      <Route path="/artisan/clients/:id"  element={<ArtisanPage><ClientProfile /></ArtisanPage>} />

      {/* ── Client portal ───────────────────────────────────── */}
      <Route path="/client/dashboard" element={
        <ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>
      } />

      {/* ── Fallback ────────────────────────────────────────── */}
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
