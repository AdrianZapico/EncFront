import React from 'react';
import { Users } from 'lucide-react';

interface UserListProps {
  users: string[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-64">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-500" />
        <h2 className="font-semibold">Online Users</h2>
      </div>
      <ul className="space-y-2">
        {users.map((user, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-sm"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;