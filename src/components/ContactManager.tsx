import React, { useState } from 'react';
import { useContacts } from '../context/ContactContext';
import { UserPlus, Check, X, Ban, Copy } from 'lucide-react';
import Alert from './Alert';
import ConfirmDialog from './ConfirmDialog';
import { useAuth } from '../context/AuthContext';

const ContactManager: React.FC = () => {
  const { user } = useAuth();
  const { 
    sendContactRequest, 
    acceptContactRequest, 
    rejectContactRequest, 
    blockContact, 
    contacts, 
    pendingRequests 
  } = useContacts();
  const [newContactTag, setNewContactTag] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const handleCopyUserTag = async () => {
    if (user?.userTag) {
      await navigator.clipboard.writeText(user.userTag);
      setSuccess('UserTag copiado para a área de transferência!');
    }
  };

  const handleAddContact = async () => {
    try {
      if (!newContactTag.startsWith('@')) {
        setError('UserTag deve começar com @');
        return;
      }

      await sendContactRequest(newContactTag);
      setSuccess('Solicitação de contato enviada com sucesso!');
      setNewContactTag('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar solicitação de contato');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptContactRequest(requestId);
      setSuccess('Solicitação de contato aceita!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao aceitar solicitação');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectContactRequest(requestId);
      setSuccess('Solicitação de contato rejeitada');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao rejeitar solicitação');
    }
  };

  const handleBlockContact = async () => {
    if (!selectedContact) return;

    try {
      await blockContact(selectedContact);
      setSuccess('Contato bloqueado com sucesso');
      setShowBlockConfirm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao bloquear contato');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} />
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Seu UserTag</h3>
        <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <span className="font-medium dark:text-white">{user?.userTag || 'Carregando...'}</span>
          <button
            onClick={handleCopyUserTag}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Compartilhe seu UserTag com amigos para que eles possam te adicionar
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Adicionar Contato</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newContactTag}
            onChange={(e) => setNewContactTag(e.target.value)}
            placeholder="Digite o @usertag"
            className="flex-1 p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleAddContact}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <UserPlus className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Digite o UserTag da pessoa que você deseja adicionar (exemplo: @usuario123)
        </p>
      </div>

      {pendingRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Solicitações Pendentes</h3>
          <div className="space-y-2">
            {pendingRequests.map((request) => (
              <div
                key={request._id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <span className="font-medium dark:text-white">{request.contactId.userTag}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request._id)}
                    className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request._id)}
                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {contacts.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Meus Contatos</h3>
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <span className="font-medium dark:text-white">{contact.contactId.userTag}</span>
                <button
                  onClick={() => {
                    setSelectedContact(contact._id);
                    setShowBlockConfirm(true);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Ban className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showBlockConfirm}
        onClose={() => setShowBlockConfirm(false)}
        onConfirm={handleBlockContact}
        title="Bloquear contato"
        message="Tem certeza que deseja bloquear este contato? Vocês não poderão mais trocar mensagens."
      />
    </div>
  );
};

export default ContactManager; 