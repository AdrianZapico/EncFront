import React from 'react';

interface ChatListProps {
  onlineUsers: string[];
  selectedChat: string | null;
  onSelectChat: (userTag: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onlineUsers, selectedChat, onSelectChat }) => {
  return (
    <div className="w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Usuários Online</h2>
      <ul>
        {onlineUsers.map(userTag => (
          <li
            key={userTag}
            className={`cursor-pointer p-2 rounded ${
              selectedChat === userTag ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => onSelectChat(userTag)}
          >
            {userTag}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
