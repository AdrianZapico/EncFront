import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, LogOut, Settings, User } from 'lucide-react';
import ThemeButton from './ThemeButton';
import { useAuth } from '../context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link to="/chat" className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold dark:text-white">EncryptedChat</span>
            </Link>

            <div className="flex items-center gap-4">
              <ThemeButton />
              
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">{user?.username}</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/settings"
                  className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${
                    location.pathname === '/settings' ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <Settings className="w-5 h-5" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-500"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default AppLayout; 