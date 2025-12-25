import React, { useState, useEffect } from 'react';
import { X, Check, XIcon, Loader, Users } from 'lucide-react';
import api from '../services/api';

interface Contact {
    _id: string;
    username: string;
    name: string;
}

interface ContactRequestsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRequestAccepted: (contact: Contact) => void;
}

const ContactRequestsModal: React.FC<ContactRequestsModalProps> = ({
    isOpen,
    onClose,
    onRequestAccepted
}) => {
    const [requests, setRequests] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchRequests();
        }
    }, [isOpen]);

    const fetchRequests = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await api.get<Contact[]>('/contacts/requests');
            setRequests(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar pedidos');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = async (requesterId: string) => {
        setProcessingId(requesterId);
        setError('');
        try {
            const response = await api.post<{ contact: Contact }>('/contacts/accept', { requesterId });

            // Remove da lista de pedidos
            setRequests(prev => prev.filter(r => r._id !== requesterId));

            // Notifica o pai para adicionar aos contatos
            onRequestAccepted(response.data.contact);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao aceitar pedido');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (requesterId: string) => {
        setProcessingId(requesterId);
        setError('');
        try {
            await api.post('/contacts/reject', { requesterId });

            // Remove da lista de pedidos
            setRequests(prev => prev.filter(r => r._id !== requesterId));

        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao rejeitar pedido');
        } finally {
            setProcessingId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col relative">
                {/* Header */}
                <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold dark:text-white">Pedidos de Amizade</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {requests.length} {requests.length === 1 ? 'pedido' : 'pedidos'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg mb-4">
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader className="w-8 h-8 animate-spin text-indigo-600" />
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                            <Users className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-center">Nenhum pedido de amizade pendente</p>
                            <p className="text-xs text-center mt-2">
                                Quando alguém te adicionar, aparecerá aqui
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {requests.map(request => (
                                <div
                                    key={request._id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                            {request.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold dark:text-white truncate">{request.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                @{request.username}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAccept(request._id)}
                                            disabled={processingId === request._id}
                                            className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                                        >
                                            {processingId === request._id ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Aceitar
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleReject(request._id)}
                                            disabled={processingId === request._id}
                                            className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                                        >
                                            {processingId === request._id ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <XIcon className="w-4 h-4" />
                                                    Rejeitar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactRequestsModal;
