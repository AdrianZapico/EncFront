import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, Lock } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import UserList from './components/UserList';
import { encryptMessage, decryptMessage } from './utils/encryption';

interface Message {
  username: string;
  message: string;
  timestamp: string;
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (data: Message) => {
      const decryptedMessage = {
        ...data,
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

    return () => {
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && socket) {
      socket.emit('join', username);
      setIsJoined(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      const encryptedMessage = encryptMessage(message);
      socket.emit('message', { message: encryptedMessage });
      setMessage('');
    }
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold">Encrypted Chat</h1>
          </div>
          <form onSubmit={handleJoin}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-2 border rounded-lg mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
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

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
        </div>
        
        <UserList users={users} />
      </div>
    </div>
  );
}

export default App;