import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCognitoAuth } from '../../hooks/useCognitoAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useCognitoAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 