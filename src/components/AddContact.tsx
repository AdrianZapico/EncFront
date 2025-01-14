import React, { useState } from 'react';
import { useContacts } from '../context/ContactContext';
import { UserPlus } from 'lucide-react';
import Alert from './Alert';

export interface AddContactProps {}

const AddContact: React.FC<AddContactProps> = () => {
  const { sendContactRequest } = useContacts();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userTag, setUserTag] = useState('');

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userTag) return;

    try {
      await sendContactRequest(userTag);
      setSuccess(`Solicitação de contato enviada para ${userTag}`);
      setUserTag('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar solicitação');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="mt-6 border-t pt-4 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">Adicionar Contato</h2>
      
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} />
      )}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handleAddContact} className="space-y-2">
        <input
          type="text"
          value={userTag}
          onChange={(e) => setUserTag(e.target.value)}
          placeholder="Digite o userTag"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Adicionar</span>
        </button>
      </form>
    </div>
  );
};

export default AddContact; 