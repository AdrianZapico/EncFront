import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useContacts } from '../context/ContactContext';
import AddContact from '../components/AddContact';
import { Check, X } from 'lucide-react';

interface ChatListProps {
  onlineUsers: string[];
  onSelectChat: (userTag: string) => void;
  selectedChat: string | null;
  unreadMessages: { [key: string]: number };
}

const ChatList: React.FC<ChatListProps> = ({
  onlineUsers,
  onSelectChat,
  selectedChat,
  unreadMessages
}) => {
  const { user } = useAuth();
  const { contacts, pendingRequests, acceptContactRequest, rejectContactRequest } = useContacts();

  // Filtra contatos aceitos e remove duplicatas
  const acceptedContacts = contacts
    .filter(contact => contact.status === 'accepted')
    .filter((contact, index, self) => 
      index === self.findIndex(c => 
        (c.userId.userTag === contact.userId.userTag && c.contactId.userTag === contact.contactId.userTag) ||
        (c.userId.userTag === contact.contactId.userTag && c.contactId.userTag === contact.userId.userTag)
      )
    );

  return (
    <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {pendingRequests.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Solicitações Pendentes</h2>
          <div className="space-y-2">
            {pendingRequests.map((request) => (
              <div
                key={request._id}
                className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <p className="text-sm font-medium dark:text-white mb-2">
                  {request.from.username} ({request.from.userTag})
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptContactRequest(request._id)}
                    className="flex-1 flex items-center justify-center gap-1 p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                  >
                    <Check className="w-4 h-4" />
                    Aceitar
                  </button>
                  <button
                    onClick={() => rejectContactRequest(request._id)}
                    className="flex-1 flex items-center justify-center gap-1 p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    Recusar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-4 dark:text-white">Meus Contatos</h2>
      <div className="space-y-2 mb-6">
        {acceptedContacts.map((contact) => {
          const contactInfo = contact.userId.userTag === user?.userTag ? contact.contactId : contact.userId;
          const isOnline = onlineUsers.includes(contactInfo.userTag);
          const unreadCount = unreadMessages[contactInfo.userTag] || 0;
          
          console.log('Contato:', contactInfo.userTag, 'Online:', isOnline);
          
          return (
            <div
              key={contactInfo.userTag}
              className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                selectedChat === contactInfo.userTag
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${unreadCount > 0 ? 'animate-pulse bg-blue-50 dark:bg-blue-800' : ''}`}
              onClick={() => onSelectChat(contactInfo.userTag)}
            >
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <span className="font-medium dark:text-white">
                    {contactInfo.username}
                  </span>
                  {isOnline && (
                    <span className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </div>
              </div>
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <AddContact />
    </div>
  );
};

export default ChatList; 