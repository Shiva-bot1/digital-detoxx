import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings  from './pages/Settings';
import NotificationManager from './components/NotificationManager';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const App = () => (
  <AuthProvider>
    <NotificationManager />
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        }/>
        <Route path="/settings" element={
          <PrivateRoute><Settings /></PrivateRoute>
        }/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;