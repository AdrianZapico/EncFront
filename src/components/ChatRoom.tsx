import React, { useEffect, useRef, useState } from 'react';
import useSocket from '../context/useSocket';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import { encryptMessage, decryptMessage } from '../utils/encryption';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import Alert from './Alert';
import ChatList from './ChatList'; // Adicionar a importação do ChatList

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  to?: string;
  from?: string;
  status?: 'sent' | 'delivered' | 'pending';
}

const ChatRoom: React.FC = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageTimestamp = useRef<number>(0);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    notificationSound.current = new Audio('/notification.mp3');
  }, []);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit('join', user.userTag);

    socket.on('userJoined', (data: { users: string[] }) => {
      console.log('Usuários online:', data.users);
      setOnlineUsers(data.users.filter(userTag => userTag !== user.userTag));
    });

    socket.on('userLeft', (data: { users: string[] }) => {
      console.log('Usuário saiu, online:', data.users);
      setOnlineUsers(data.users.filter(userTag => userTag !== user.userTag));
    });

    socket.on('message', (data: Message) => {
      if (data.from === user.userTag) return;

      if (data.to === user.userTag) {
        const decryptedMessage = {
          ...data,
          message: decryptMessage(data.message)
        };

        setMessages(prev => {
          const messageExists = prev.some(msg => msg.id === data.id);
          if (messageExists) return prev;
          return [...prev, decryptedMessage];
        });

        if (selectedChat !== data.from) {
          if (notificationSound.current) {
            notificationSound.current.play().catch(console.error);
          }
        }

        if (selectedChat === data.from) {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    socket.on('messageEdited', (data: { id: string; newMessage: string }) => {
      const decryptedMessage = decryptMessage(data.newMessage);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === data.id ? { ...msg, message: decryptedMessage } : msg
        )
      );
    });

    socket.on('messageDeleted', (messageId: string) => {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    });

    socket.on('error', (error: string) => {
      setError(error);
      setTimeout(() => setError(''), 5000);
    });

    socket.on('messageDelivered', (data: { id: string; status: 'delivered' | 'pending' }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === data.id ? { ...msg, status: data.status } : msg
        )
      );
    });

    return () => {
      socket.off('message');
      socket.off('messageEdited');
      socket.off('messageDeleted');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('error');
      socket.off('messageDelivered');
      setMessages([]);
    };
  }, [socket, user, selectedChat]);

  const handleSendMessage = (message: string) => {
    if (!socket || !user || !selectedChat) {
      setError('Selecione um contato para enviar mensagem');
      return;
    }

    const now = Date.now();
    if (now - lastMessageTimestamp.current < 2000) {
      setError('Aguarde um momento antes de enviar outra mensagem');
      return;
    }

    if (messageTimeoutRef.current) {
      setError('Você está enviando mensagens muito rápido');
      return;
    }

    const messageId = Math.random().toString(36).substr(2, 9);
    const newMessage = {
      id: messageId,
      username: user.username,
      message: message,
      timestamp: new Date().toISOString(),
      from: user.userTag,
      to: selectedChat,
      status: 'sent' as const
    };

    setMessages(prev => [...prev, newMessage]);

    socket.emit('message', {
      ...newMessage,
      message: encryptMessage(message)
    });

    lastMessageTimestamp.current = now;
    messageTimeoutRef.current = setTimeout(() => {
      messageTimeoutRef.current = null;
    }, 1000);
  };

  const handleEditMessage = (id: string, newMessage: string) => {
    if (!socket || !user || !selectedChat) return;

    const encryptedMessage = encryptMessage(newMessage);
    socket.emit('editMessage', {
      id,
      newMessage: encryptedMessage,
      to: selectedChat
    });
  };

  const handleDeleteMessage = (id: string) => {
    if (!socket || !user || !selectedChat) return;
    socket.emit('deleteMessage', {
      messageId: id,
      to: selectedChat
    });
  };

  const filteredMessages = messages.filter(msg =>
    (msg.from === selectedChat && msg.to === user?.userTag) ||
    (msg.from === user?.userTag && msg.to === selectedChat)
  );

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto flex gap-4 p-4">
      <ChatList
        onlineUsers={onlineUsers}
        onSelectChat={setSelectedChat}
        selectedChat={selectedChat}
      />

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl md:text-2xl font-bold dark:text-white">
              {selectedChat ? `Chat com ${selectedChat}` : 'Selecione um contato'}
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
          {filteredMessages.map((msg) => (
            <div
              key={`${msg.id}-${msg.timestamp}`}
              className="animate-slide-in"
            >
              <ChatMessage
                id={msg.id}
                username={msg.username}
                message={msg.message}
                timestamp={msg.timestamp}
                isCurrentUser={msg.from === user.userTag}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                status={msg.status}
              />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <MessageInput onSendMessage={handleSendMessage} disabled={!selectedChat} />
      </div>
    </div>
  );
};

export default ChatRoom;
