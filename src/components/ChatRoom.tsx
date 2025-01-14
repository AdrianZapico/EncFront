import React, { useEffect, useRef, useState } from 'react';
import useSocket from '../context/useSocket';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import UserList from './UserList';
import { encryptMessage, decryptMessage } from '../utils/encryption';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Alert from './Alert';

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: string;
}

const ChatRoom: React.FC = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageTimestamp = useRef<number>(0);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket || !user) return;

    if (user.username) {
      socket.emit('join', user.username);
    }

    socket.on('message', (data: Message) => {
      const decryptedMessage = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        message: decryptMessage(data.message)
      };
      setMessages(prev => [...prev, decryptedMessage]);
    });

    socket.on('userJoined', ({ users }) => {
      setUsers(users);
    });

    socket.on('userLeft', ({ users }) => {
      setUsers(users);
    });

    socket.on('error', (error: string) => {
      setError(error);
      setTimeout(() => setError(''), 5000);
    });

    return () => {
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('error');
    };
  }, [socket, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (message: string) => {
    if (!socket || !user) return;

    const now = Date.now();
    if (now - lastMessageTimestamp.current < 2000) {
      setError('Aguarde um momento antes de enviar outra mensagem');
      return;
    }

    if (messageTimeoutRef.current) {
      setError('Você está enviando mensagens muito rápido');
      return;
    }

    const encryptedMessage = encryptMessage(message);
    socket.emit('message', {
      username: user.username,
      message: encryptedMessage,
      timestamp: new Date().toISOString()
    });

    lastMessageTimestamp.current = now;
    messageTimeoutRef.current = setTimeout(() => {
      messageTimeoutRef.current = null;
    }, 1000);
  };

  const handleEditMessage = (id: string, newMessage: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, message: newMessage } : msg
      )
    );
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
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
            <Lock className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl md:text-2xl font-bold dark:text-white">
              Chat Criptografado
            </h1>
          </div>
        </div>
        
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}
        
        <div className="h-[calc(100vh-250px)] md:h-[calc(100vh-200px)] overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <ChatMessage
              key={msg.id || index}
              id={msg.id}
              username={msg.username}
              message={msg.message}
              timestamp={msg.timestamp}
              isCurrentUser={msg.username === user.username}
              onEdit={handleEditMessage}
              onDelete={handleDeleteMessage}
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
