
import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';

// A function to check if the user is authenticated
const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  console.log('Retrieved tokern',token);
  console.log('is token valid:',!!token);
  return !!token; // Return true if token exists, otherwise false
};

const ProtectedRoute: React.FC = () => {
  return isAuthenticated() ? (
    <Outlet /> // Render child routes if authenticated
  ) : (
    <Navigate to="/login" /> // Redirect to login if not authenticated
  );
};

export default ProtectedRoute;

