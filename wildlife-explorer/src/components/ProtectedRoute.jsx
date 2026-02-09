import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminProtectedRoute = () => {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  const location = useLocation();

  // 🔍 DEBUG LOGS
  console.log("🔐 Auth state:", {
    isLoggedIn,
    isAdmin,
    loading,
    location: location.pathname,
  });

  if (loading) {
    console.log("⏳ Loading...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    console.log("🚫 Not logged in, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdmin) {
    console.log("✅ Admin access granted, rendering Outlet");
    return <Outlet />;
  } else {
    console.log("❌ Not admin, redirecting to home");
    return <Navigate to="/" state={{ from: location }} replace />;
  }
};

export default AdminProtectedRoute;
