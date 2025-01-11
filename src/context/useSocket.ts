// useSocket.ts
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000'); // URL corrigida
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return socket;
};

export default useSocket;
