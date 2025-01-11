import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ChatMessageProps {
  username: string;
  message: string;
  timestamp: string;
  isCurrentUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  username,
  message,
  timestamp,
  isCurrentUser
}) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`flex max-w-[70%] ${
          isCurrentUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        } rounded-lg p-3 ${isCurrentUser ? 'rounded-br-none' : 'rounded-bl-none'}`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle className="w-4 h-4" />
            <span className="font-semibold text-sm">{username}</span> {/* Exibindo username */}
          </div>
          <p className="text-sm break-words break-all whitespace-pre-wrap">{message}</p>
          <span className="text-xs opacity-75 mt-1 block">
            {new Date(timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
