// JoinChat.tsx
import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface JoinChatProps {
  onJoin: (username: string) => void;
}

const JoinChat: React.FC<JoinChatProps> = ({ onJoin }) => {
  const [username, setUsername] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onJoin(username);
    }
  };

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
};

export default JoinChat;
