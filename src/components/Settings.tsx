import React, { useState } from 'react';
import { User, Shield, Bell, Moon, Sun, Smartphone, Key, Globe, Trash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeButton from './ThemeButton';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';

interface NotificationSettings {
  messages: boolean;
  sounds: boolean;
  desktop: boolean;
}

const Settings: React.FC = () => {
  const { user, deleteAccount, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [notifications, setNotifications] = useState<NotificationSettings>({
    messages: true,
    sounds: true,
    desktop: false,
  });
  const [language, setLanguage] = useState('pt-BR');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile({ username });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Perfil */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
          <User className="w-6 h-6" />
          Perfil
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditing}
                className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isLoading ? 'Salvando...' : isEditing ? 'Salvar' : 'Editar'}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>

      {/* Aparência */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
          <Sun className="w-6 h-6" />
          Aparência
        </h2>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Tema</span>
          <ThemeButton />
        </div>
      </div>

      {/* Notificações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Notificações
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Notificações de mensagens</span>
            <input
              type="checkbox"
              checked={notifications.messages}
              onChange={(e) => setNotifications(prev => ({ ...prev, messages: e.target.checked }))}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Sons de notificação</span>
            <input
              type="checkbox"
              checked={notifications.sounds}
              onChange={(e) => setNotifications(prev => ({ ...prev, sounds: e.target.checked }))}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Notificações desktop</span>
            <input
              type="checkbox"
              checked={notifications.desktop}
              onChange={(e) => setNotifications(prev => ({ ...prev, desktop: e.target.checked }))}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Idioma */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
          <Globe className="w-6 h-6" />
          Idioma
        </h2>
        
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>

      {/* Segurança */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Segurança
        </h2>
        
        <button
          onClick={() => {/* Implementar alteração de senha */}}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Key className="w-5 h-5" />
          Alterar Senha
        </button>
      </div>

      {/* Dispositivos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
          <Smartphone className="w-6 h-6" />
          Dispositivos Conectados
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium dark:text-white">Chrome - Windows</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Último acesso: Hoje, 14:30</p>
              </div>
            </div>
            <button className="text-red-500 hover:text-red-600">
              <Trash className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Zona Perigosa */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-red-600 dark:text-red-400 flex items-center gap-2">
          Zona Perigosa
        </h2>
        
        <button
          onClick={handleDeleteAccount}
          className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Excluir Conta
        </button>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteAccount}
        title="Excluir conta"
        message="Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão perdidos permanentemente."
      />
    </div>
  );
};

export default Settings; 