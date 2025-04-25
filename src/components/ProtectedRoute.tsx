
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, retrySessionLoad } = useAuth();
  const [retrying, setRetrying] = useState(false);

  console.log("Protected route", { user, loading });

  // If still loading, show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ritual-paper">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ritual-green mx-auto mb-4"></div>
          <p className="text-lg text-ritual-forest">Loading your session...</p>
        </div>
      </div>
    );
  }

  // If no user is found after loading completes, show retry UI
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-ritual-paper">
        <div className="text-center mb-4">
          <p className="text-lg text-ritual-forest mb-2">Session could not be loaded or has expired.</p>
          <p className="text-md text-ritual-forest/80">Please sign in again or try reloading your session.</p>
        </div>
        <button
          className="px-6 py-2 rounded bg-ritual-green text-white font-semibold hover:bg-ritual-forest transition"
          onClick={async () => {
            setRetrying(true);
            retrySessionLoad();
            setTimeout(() => setRetrying(false), 2000);
          }}
          disabled={retrying}
        >
          {retrying ? 'Retrying...' : 'Retry Session'}
        </button>
        <div className="mt-4">
          <a href="/auth" className="text-ritual-green underline">Go to Sign In</a>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
