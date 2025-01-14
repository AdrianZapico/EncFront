import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface User {
  _id: string;
  username: string;
  userTag: string;
}

interface Contact {
  _id: string;
  userId: User;
  contactId: User;
  status: 'pending' | 'accepted' | 'rejected';
}

interface ContactRequest {
  _id: string;
  from: User;
  to: User;
  status: 'pending' | 'accepted' | 'rejected';
}

interface ContactContextData {
  contacts: Contact[];
  pendingRequests: ContactRequest[];
  sendContactRequest: (userTag: string) => Promise<void>;
  acceptContactRequest: (requestId: string) => Promise<void>;
  rejectContactRequest: (requestId: string) => Promise<void>;
}

const ContactContext = createContext<ContactContextData>({} as ContactContextData);

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ContactRequest[]>([]);

  useEffect(() => {
    if (user) {
      loadContacts();
      loadPendingRequests();
    }
  }, [user]);

  const loadContacts = async () => {
    try {
      const response = await api.get<Contact[]>('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
      setContacts([]);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const response = await api.get<ContactRequest[]>('/contacts/requests/pending');
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Erro ao carregar solicitações pendentes:', error);
      setPendingRequests([]);
    }
  };

  const sendContactRequest = async (userTag: string) => {
    try {
      await api.post('/contacts/request', { userTag });
      await loadContacts();
      await loadPendingRequests();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Erro ao enviar solicitação de contato');
    }
  };

  const acceptContactRequest = async (requestId: string) => {
    try {
      await api.post(`/contacts/request/${requestId}/accept`);
      await loadContacts();
      await loadPendingRequests();
    } catch (error) {
      console.error('Erro ao aceitar solicitação:', error);
    }
  };

  const rejectContactRequest = async (requestId: string) => {
    try {
      await api.post(`/contacts/request/${requestId}/reject`);
      await loadPendingRequests();
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
    }
  };

  return (
    <ContactContext.Provider
      value={{
        contacts,
        pendingRequests,
        sendContactRequest,
        acceptContactRequest,
        rejectContactRequest,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
}; 