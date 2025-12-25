export interface User {
  id: string;
  username: string;
  token: string;
}

export interface Contact {
  _id: string; // ID do MongoDB
  username: string;
  name?: string;
  isOnline?: boolean; // Vamos controlar isso no front
  unreadCount?: number;
}

export interface Message {
  id: string;
  senderId: string; // Quem enviou
  recipientId: string; // Quem recebe
  username: string; // Nome para exibição
  message: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'pending';
  from?: string; // Mantido para compatibilidade visual antiga
  to?: string;   // Mantido para compatibilidade visual antiga
}