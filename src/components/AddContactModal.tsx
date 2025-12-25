import React, { useState } from 'react';
import { X, Search, UserPlus, Loader } from 'lucide-react';
import api from '../services/api';

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContactAdded: (contact: { _id: string; username: string; name: string }) => void;
}

interface SearchedUser {
    _id: string;
    username: string;
    name: string;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onContactAdded }) => {
    const [nickname, setNickname] = useState('');
    const [searchedUser, setSearchedUser] = useState<SearchedUser | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    if (!isOpen) return null;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSearchedUser(null);

        if (!nickname.trim()) {
            setError('Digite um nickname para buscar');
            return;
        }

        setIsSearching(true);
        try {
            const response = await api.post<SearchedUser>('/search-user', { nickname: nickname.trim() });
            setSearchedUser(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Usuário não encontrado');
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddContact = async () => {
        if (!searchedUser) return;

        setIsAdding(true);
        setError('');

        try {
            const response = await api.post('/contacts/add', { contactId: searchedUser._id });

            // Verifica se foi aceito automaticamente ou se enviou pedido
            const message = response.data.message;
            if (message.includes('automaticamente')) {
                setSuccess(`Vocês agora são contatos!`);
                // Notifica o componente pai
                onContactAdded(searchedUser);
            } else {
                setSuccess(`Pedido enviado para ${searchedUser.username}!`);
                // Não adiciona aos contatos ainda, só quando aceitar
            }

            // Limpa o formulário após 2s e fecha
            setTimeout(() => {
                setNickname('');
                setSearchedUser(null);
                setSuccess('');
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao adicionar contato');
        } finally {
            setIsAdding(false);
        }
    };

    const handleClose = () => {
        setNickname('');
        setSearchedUser(null);
        setError('');
        setSuccess('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
                {/* Botão Fechar */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white">Adicionar Contato</h2>
                </div>

                {/* Formulário de Busca */}
                <form onSubmit={handleSearch} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Buscar por nickname
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="Digite o @username exato"
                            className="flex-1 p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={isSearching}
                        />
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                        >
                            {isSearching ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                <Search className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </form>

                {/* Mensagens de Erro */}
                {error && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg mb-4">
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                )}

                {/* Mensagens de Sucesso */}
                {success && (
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg mb-4">
                        <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
                    </div>
                )}

                {/* Usuário Encontrado */}
                {searchedUser && !success && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                    {searchedUser.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-semibold dark:text-white">{searchedUser.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">@{searchedUser.username}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAddContact}
                            disabled={isAdding}
                            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                        >
                            {isAdding ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Adicionando...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Enviar Pedido de Amizade
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Dica */}
                <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        💡 <strong>Dica:</strong> Digite o @username exato do usuário que deseja adicionar. A busca diferencia maiúsculas de minúsculas.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddContactModal;
