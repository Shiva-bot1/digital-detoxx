import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../services/api';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          id:    session.user.id,
          name:  session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          email: session.user.email,
        });
        setToken(session.access_token);
      }
      setLoading(false);
    });

    // Listen for auth changes — handles login, logout, token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const userData = {
            id:    session.user.id,
            name:  session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            email: session.user.email,
          };
          setUser(userData);
          setToken(session.access_token);

          // Sync user to our users table
          try {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/auth/sync`,
              userData
            );
          } catch (err) {
            console.error('User sync failed:', err);
          }
        } else {
          setUser(null);
          setToken(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const register = async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw error;
    return data;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);