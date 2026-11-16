import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  loginAsDemoAdmin: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Purana demo-admin session agar browser mein reh gaya ho to hata do
    try {
      localStorage.removeItem('raees_demo_admin_session');
    } catch {}
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sirf Firebase mein bane hue user hi login kar sakte hain
  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      setLoading(false);
      return true;
    } catch (err: any) {
      console.warn('Login error:', err.code);
      setError('Email ya password galat hai.');
      setLoading(false);
      return false;
    }
  };

  // Demo login band kar diya gaya hai
  const loginAsDemoAdmin = async (): Promise<boolean> => false;

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Signout error:', e);
    }
    setUser(null);
  };

  const clearError = () => setError(null);

  const isAdmin = Boolean(user);

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loading, error, loginWithEmail, loginAsDemoAdmin, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};