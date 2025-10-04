import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null); // null = loading, false = not authenticated, true = authenticated
  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuth(false);
        return;
      }

      try {
        const res = await axios.get(`${backendUrl}/api/auth/validate-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuth(res.data.success);
      } catch (err) {
        console.error("Auth validation failed:", err);
        setIsAuth(false);
      }
    };

    checkAuth();
  }, [backendUrl]);

  if (isAuth === null) {
    return <p className="text-white text-center mt-20">Checking authentication...</p>;
  }

  if (isAuth === false) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
