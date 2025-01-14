import React, { useEffect, useRef, useState } from 'react';
import useSocket from '../context/useSocket';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import UserList from './UserList';
import { encryptMessage, decryptMessage } from '../utils/encryption';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Message {
  username: string;
  message: string;
  timestamp: string;
}

const ChatRoom: React.FC = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !user) return;

    // Verificar e enviar username correto
    if (user.username) {
      console.log(`Enviando username: ${user.username}`);
      socket.emit('join', user.username);
    }

    socket.on('message', (data: Message) => {
      const decryptedMessage = {
        ...data,
        message: decryptMessage(data.message)
      };
      setMessages(prev => [...prev, decryptedMessage]);
    });

    socket.on('userJoined', ({ users }) => {
      console.log('Usuários online:', users);
      setUsers(users);
    });

    socket.on('userLeft', ({ users }) => {
      console.log('Usuário saiu:', users);
      setUsers(users);
    });

    return () => {
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [socket, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (message: string) => {
    if (socket && user) {
      const encryptedMessage = encryptMessage(message);
      socket.emit('message', { username: user.username, message: encryptedMessage });
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 p-4">
      <div className="md:hidden">
        <UserList users={users} />
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl md:text-2xl font-bold dark:text-white">
              Encrypted Chat
            </h1>
          </div>
        </div>
        
        <div className="h-[calc(100vh-250px)] md:h-[calc(100vh-200px)] overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              username={msg.username}
              message={msg.message}
              timestamp={msg.timestamp}
              isCurrentUser={msg.username === user.username}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <MessageInput onSendMessage={handleSendMessage} />
      </div>
      
      <div className="hidden md:block">
        <UserList users={users} />
      </div>
    </div>
  );
};

export default ChatRoom;
