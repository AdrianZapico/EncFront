import React, { useEffect, useRef, useState } from 'react';
import useSocket from '../context/useSocket';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import UserList from './UserList';
import { encryptMessage, decryptMessage } from '../utils/encryption';
import { Lock } from 'lucide-react';

interface ChatRoomProps {
  username: string;
}

interface Message {
  username: string;
  message: string;
  timestamp: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ username }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    // Verificar e enviar username correto
    if (username) {
      console.log(`Enviando username: ${username}`); // Log para verificação
      socket.emit('join', username);
    }

    socket.on('message', (data: Message) => {
      const decryptedMessage = {
        ...data,
        message: decryptMessage(data.message)
      };
      setMessages(prev => [...prev, decryptedMessage]);
    });

    socket.on('userJoined', ({ users }) => {
      console.log('Usuários online:', users); // Log para verificação
      setUsers(users);
    });

    socket.on('userLeft', ({ users }) => {
      console.log('Usuário saiu:', users); // Log para verificação
      setUsers(users);
    });

    return () => {
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [socket, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (message: string) => {
    if (socket) {
      const encryptedMessage = encryptMessage(message);
      socket.emit('message', { username, message: encryptedMessage });
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex gap-4">
      <div className="flex-1 bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Encrypted Chat</h1>
        </div>
        
        <div className="h-[calc(100vh-250px)] overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              username={msg.username}
              message={msg.message}
              timestamp={msg.timestamp}
              isCurrentUser={msg.username === username}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <MessageInput onSendMessage={handleSendMessage} />
      </div>
      
      <UserList users={users} />
    </div>
  );
};

export default ChatRoom;
