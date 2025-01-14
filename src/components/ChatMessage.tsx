import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, CheckCheck, Clock, Pencil, Trash2 } from 'lucide-react';

interface ChatMessageProps {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  isCurrentUser: boolean;
  onEdit: (id: string, newMessage: string) => void;
  onDelete: (id: string) => void;
  status?: 'sent' | 'delivered' | 'pending';
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  username,
  message,
  timestamp,
  isCurrentUser,
  onEdit,
  onDelete,
  status
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

  const handleEdit = () => {
    if (editedMessage.trim() && editedMessage !== message) {
      onEdit(id, editedMessage);
    }
    setIsEditing(false);
  };

  const getStatusIcon = () => {
    if (!isCurrentUser) return null;
    
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex ${
        isCurrentUser ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isCurrentUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">{username}</span>
          {isCurrentUser && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-blue-700 rounded transition-colors"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                onClick={() => onDelete(id)}
                className="p-1 hover:bg-blue-700 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              className="flex-1 p-1 rounded bg-blue-700 text-white border border-blue-400"
              autoFocus
            />
            <button
              onClick={handleEdit}
              className="px-2 py-1 bg-blue-700 rounded hover:bg-blue-800 transition-colors"
            >
              Salvar
            </button>
          </div>
        ) : (
          <p className="break-words">{message}</p>
        )}

        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs opacity-75">
            {formatDistanceToNow(new Date(timestamp), {
              addSuffix: true,
              locale: ptBR
            })}
          </span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;