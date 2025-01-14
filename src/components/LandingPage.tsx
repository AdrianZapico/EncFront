import React from 'react';
import { Shield, MessageSquare, Lock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeButton from './ThemeButton';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold dark:text-white">EncryptedChat</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeButton />
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Registrar
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 dark:text-white">
            Comunicação Segura e Privada
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Chat em tempo real com criptografia ponta a ponta
          </p>
          <Link
            to="/register"
            className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Começar Agora
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <Lock className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 dark:text-white">Criptografia E2E</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Suas mensagens são criptografadas de ponta a ponta, garantindo total privacidade.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <MessageSquare className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 dark:text-white">Chat em Tempo Real</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Comunicação instantânea com outros usuários em tempo real.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <Users className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 dark:text-white">Salas Privadas</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Crie salas privadas para conversas seguras em grupo.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <span className="font-bold dark:text-white">EncryptedChat</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              © 2024 EncryptedChat. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 