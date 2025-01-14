import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import ChatRoom from './components/ChatRoom';
import AuthLayout from './components/AuthLayout';
import Settings from './components/Settings';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Navigate to="/auth/login" />} />
          <Route path="/register" element={<Navigate to="/auth/register" />} />

          {/* Rotas de autenticação */}
          <Route path="/auth">
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Rotas protegidas */}
          <Route path="/app" element={<AuthLayout />}>
            <Route path="chat" element={<ChatRoom />} />
            <Route path="settings" element={<Settings />} />
            <Route index element={<Navigate to="chat" replace />} />
          </Route>

          {/* Rota de fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
