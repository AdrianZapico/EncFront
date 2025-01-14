import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Alert from './Alert';
import ConfirmDialog from './ConfirmDialog';
import ContactManager from './ContactManager';

export default function Settings() {
  const auth = useAuth();
  const [username, setUsername] = useState(auth.user?.username || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'contacts'>('profile');

  const handleUpdateProfile = async () => {
    try {
      await auth.updateProfile({ username });
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
    }
  };

  const confirmDeleteAccount = async () => {
    try {
      await auth.deleteAccount();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar conta');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
              >
                Perfil
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`${
                  activeTab === 'contacts'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
              >
                Contatos
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' ? (
              <>
                <div className="space-y-6">
                  {error && (
                    <Alert type="error" message={error} onClose={() => setError(null)} />
                  )}
                  {success && (
                    <Alert type="success" message={success} onClose={() => setSuccess(null)} />
                  )}

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Seu UserTag</h3>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-lg font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
                        {auth.user?.userTag || 'Carregando...'}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(auth.user?.userTag || '');
                          setSuccess('UserTag copiado para a área de transferência!');
                        }}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Compartilhe seu UserTag com outros usuários para que eles possam te adicionar como contato.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nome de usuário</h3>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleUpdateProfile}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Salvar alterações
                    </button>
                  </div>

                  <div className="pt-6">
                    <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                            Zona Perigosa
                          </h3>
                          <div className="mt-2">
                            <button
                              onClick={() => setShowDeleteConfirm(true)}
                              className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 font-medium"
                            >
                              Deletar minha conta
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <ContactManager />
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteAccount}
        title="Deletar conta"
        message="Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita."
      />
    </div>
  );
} 