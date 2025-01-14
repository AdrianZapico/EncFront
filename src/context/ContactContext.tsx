import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Contact {
  _id: string;
  userId: {
    username: string;
    userTag: string;
  };
  contactId: {
    username: string;
    userTag: string;
  };
  status: 'pending' | 'accepted' | 'blocked';
  nickname: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ContactContextType {
  contacts: Contact[];
  pendingRequests: Contact[];
  sendContactRequest: (userTag: string) => Promise<void>;
  acceptContactRequest: (requestId: string) => Promise<void>;
  rejectContactRequest: (requestId: string) => Promise<void>;
  blockContact: (contactId: string) => Promise<void>;
  refreshContacts: () => Promise<void>;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Contact[]>([]);

  const fetchContacts = async () => {
    if (!user) return;

    try {
      const response = await fetch('http://localhost:5000/contacts', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao buscar contatos');

      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    }
  };

  const fetchPendingRequests = async () => {
    if (!user) return;

    try {
      const response = await fetch('http://localhost:5000/contacts/pending', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao buscar solicitações pendentes');

      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      console.error('Erro ao buscar solicitações pendentes:', error);
    }
  };

  const refreshContacts = async () => {
    await Promise.all([fetchContacts(), fetchPendingRequests()]);
  };

  useEffect(() => {
    if (user) {
      refreshContacts();
    } else {
      setContacts([]);
      setPendingRequests([]);
    }
  }, [user]);

  const sendContactRequest = async (userTag: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    const response = await fetch('http://localhost:5000/contacts/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify({ userTag }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao enviar solicitação de contato');
    }

    await refreshContacts();
  };

  const acceptContactRequest = async (requestId: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    const response = await fetch(`http://localhost:5000/contacts/accept/${requestId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao aceitar solicitação');
    }

    await refreshContacts();
  };

  const rejectContactRequest = async (requestId: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    const response = await fetch(`http://localhost:5000/contacts/reject/${requestId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao rejeitar solicitação');
    }

    await refreshContacts();
  };

  const blockContact = async (contactId: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    const response = await fetch(`http://localhost:5000/contacts/block/${contactId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao bloquear contato');
    }

    await refreshContacts();
  };

  return (
    <ContactContext.Provider
      value={{
        contacts,
        pendingRequests,
        sendContactRequest,
        acceptContactRequest,
        rejectContactRequest,
        blockContact,
        refreshContacts,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContacts deve ser usado dentro de um ContactProvider');
  }
  return context;
}; 