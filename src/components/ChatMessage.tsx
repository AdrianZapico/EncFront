import  { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoreVertical, Edit2, Trash2, X, Check } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface ChatMessageProps {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  isCurrentUser: boolean;
  onEdit: (id: string, newMessage: string) => void;
  onDelete: (id: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  username,
  message,
  timestamp,
  isCurrentUser,
  onEdit,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);
  const [showOptions, setShowOptions] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleEdit = () => {
    if (editedMessage.trim() !== message) {
      onEdit(id, editedMessage);
    }
    setIsEditing(false);
    setShowOptions(false);
  };

  const handleDelete = () => {
    setShowConfirmDialog(true);
    setShowOptions(false);
  };

  const messageTime = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <>
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`relative max-w-[80%] ${isCurrentUser ? 'order-1' : 'order-2'}`}>
          {isCurrentUser && (
            <div className="absolute top-2 right-2 z-10">
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>

                {showOptions && (
                  <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div
            className={`rounded-lg p-3 ${
              isCurrentUser
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
            }`}
          >
            {!isCurrentUser && (
              <div className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                {username}
              </div>
            )}

            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  className="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded px-2 py-1 text-sm"
                  autoFocus
                />
                <button
                  onClick={handleEdit}
                  className="p-1 hover:bg-indigo-700 rounded transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedMessage(message);
                  }}
                  className="p-1 hover:bg-indigo-700 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="break-words">{message}</div>
            )}

            <div className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
              {messageTime}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => onDelete(id)}
        title="Excluir mensagem"
        message="Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita."
      />
    </>
  );
};

export default ChatMessage;