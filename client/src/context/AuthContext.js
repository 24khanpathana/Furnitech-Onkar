import React, { createContext, useContext, useEffect, useState } from 'react';
import { getProfile, loginAdmin, loginWorker } from '../services/api';

const STORAGE_KEY = 'onkar_auth';

const AuthContext = createContext(null);

const readStoredSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!readStoredSession()?.token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await getProfile();
        const nextSession = { ...readStoredSession(), user: data.user };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
        setSession(nextSession);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async ({ role, email, password }) => {
    const request = role === 'admin' ? loginAdmin : loginWorker;
    const { data } = await request({ email, password });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        token: session?.token || null,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
