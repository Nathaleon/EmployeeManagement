import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Berikan waktu sedikit untuk auth state ter-load dari localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Debug logs
  console.log("ProtectedRoute - Auth state:", auth);
  console.log("ProtectedRoute - Access Token:", auth?.accessToken);
  console.log("ProtectedRoute - Is Loading:", isLoading);

  // Tampilkan loading sementara auth state sedang dimuat
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Cek apakah user sudah login
  if (!auth || !auth.accessToken || !auth.username) {
    console.log("ProtectedRoute - Redirecting to login because auth is incomplete.");
    console.log("ProtectedRoute - Auth object:", JSON.stringify(auth, null, 2));
    return <Navigate to="/login" replace />;
  }

  console.log("ProtectedRoute - Access granted. Rendering child component.");
  return children;
};

export default ProtectedRoute;