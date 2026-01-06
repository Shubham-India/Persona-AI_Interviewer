import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import baseApi from "../../services/apiService";


export default function ProtectedRoute({ children }) {
  const { user, loading_auth } = useAuth();
//   const Navigate = useNavigate();


  if (loading_auth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#FCFBF8]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 font-bold text-stone-500">Persisting Session...</p>
      </div>
    );
  }


  if (!user) {

    return <Navigate to="/" replace />;
  }

  return children;
}