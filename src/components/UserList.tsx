import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';

interface UserListProps {
  users: string[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between md:justify-start gap-2 mb-4"
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold dark:text-white">
            Usuários Online ({users.length})
          </h2>
        </div>
        <div className="md:hidden">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>
      
      <div className={`${!isExpanded && 'hidden md:block'}`}>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          {users.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic col-span-2">
              Nenhum usuário online
            </p>
          ) : (
            users.map((user, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-700 dark:text-gray-200 truncate">{user}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {!isExpanded && (
        <div className="md:hidden flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          {users.length} {users.length === 1 ? 'usuário' : 'usuários'} online
        </div>
      )}
    </div>
  );
};

export default UserList;