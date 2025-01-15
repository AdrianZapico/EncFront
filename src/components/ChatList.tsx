import React from 'react';

interface ChatListProps {
  onlineUsers: string[];
  selectedChat: string | null;
  onSelectChat: (username: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onlineUsers, selectedChat, onSelectChat }) => {
  return (
    <div className="w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Usuários Online</h2>
      <ul>
        {onlineUsers.map(username => (
          <li
            key={username}
            className={`cursor-pointer p-2 rounded ${
              selectedChat === username ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => onSelectChat(username)}
          >
            {username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
