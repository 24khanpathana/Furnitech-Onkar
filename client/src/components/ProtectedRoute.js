import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="glass-card w-full max-w-md p-8 text-center">
          <p className="text-lg font-semibold">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/worker/login'} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/worker/dashboard'} replace />;
  }

  return children;
}

export default ProtectedRoute;
